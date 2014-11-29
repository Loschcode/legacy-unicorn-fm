define(['core/dependencies/config', 'main', 'cookies'], function(Config, Main, Cookies)  {

    var Queries = {

        /**
         * The selector store will store the selectors we want to transmit from front-end to front-end without back-end intervention
         * Look up at the emit_socket() function for more details.
         */
        selector_store: {},

        /**
         * Will check if the object is empty every X milliseconds and give a feedback if it's not empty
         * @param  {data} object data object to check (from Main.datas.get())
         * @param  {integer} ms   milliseconds
         * @param {function} callback
         * @return {void}      
         */
        try_object: function(data, ms, callback) {

            time = setInterval(function() { 

                object = Main.datas.get(data);

                if (JSON.stringify(object).length > 2) {
                    
                    clearInterval(time);
                    callback(true);

                }

            }, ms);
        },

        /**
         * Will handle the casual sockets calls
         * @param  {string} method     the method to call
         * @param {object} datas the datas that contains all the important things
         * @return {void}
         */
        handle_listeners: function(controller, datas) {

            method = datas.method;
            params = datas.params;

            if (typeof datas.callback !== "undefined") {

                callback_key = datas.callback;

            } else {

                callback_key = false;

            }

            console.info('Socket : Received listener `%s`.`%s`', controller, method);

            (function(method, params, callback_key) {

                    require(['app/sockets/listeners/' + controller + '_listener'], function(Socket) {

                        pre = 'listener_';

                        if (typeof Socket[pre+method] !== "undefined") {

                            if (callback_key) {

                                // We will emit a unique socket with it that will be received by the server in a specific area then removed from the listeners
                                // It's more a fake callback than a true one but it's the same
                                callback_system = function (feedback) {

                                    console.info('Socket : Callback `%s` sent to the server', callback_key);
                                    Main.socket().emit('callbacks', {key: callback_key, feedback: feedback});

                                }

                            } else {

                                // If the system didn't want a callback, we able the user to do it but it will go nowhere
                                callback_system = function() {};

                            }

                            /**
                             * We call effectively the listener
                             * With the complete datas
                             */
                            Socket[pre+method].apply(self, [
                                
                                params,
                                callback_system

                            ]);

                        } else {

                            console.warn('Warning : Unknown listener `%s`.`%s`', controller, method);

                        }

                    });

            })(method, params, callback_key);            

        },

        /**
         * Handle the listeners and execute the correct one (in /sockets/)
         * @param  {object} datas containing success, datas, possibly cookie and controller, method
         * @return {void}
         */
        handle_feedbacks: function(datas) {

            controller = datas.controller;
            method = datas.method;

            console.info('Socket : Received feedback from socket `%s`.`%s`', controller, method);

            success = datas.success;

            if (success === false) {

                console.warn('Warning : request failed on feedback `%s`.`%s` : %s', controller, method, datas.error);

            } else {

                // If there's a cookie to save
                this.save_cookies_from_socket(datas);

                self = this;

                /**
                 * This is made to do not lose the controller, method and datas in case the function is called twice
                 * At the same time.
                 * Because JavaScript sucks a lot. Asynchronous is shit and everyone knows it.
                 */
                (function(controller, method, datas) {

                    require(['app/sockets/feedbacks/' + controller + '_feedback'], function(Listener) {

                        // Methods prefix
                        pre = 'feedback_';

                        if (typeof Listener[pre+method] !== "undefined") {

                            /**
                             * We check the selector store in case we got a selector for this function
                             */
                            if (typeof self.selector_store[controller+'.'+method] !== "undefined") {

                                datas.selector = self.selector_store[controller+'.'+method];
                                delete self.selector_store[controller+'.'+method];
                                
                            } else {

                                datas.selector = false;

                            }

                            /**
                             * We call effectively the listener
                             * With the complete datas
                             */
                            Listener[pre+method].apply(self, [datas]);

                        } else {

                            console.warn('Warning : Unknown feedback `%s`.`%s`', controller, method);

                        }

                    });

                })(controller, method, datas);

            }

        },

        /**
         * Handle received cookies from socket
         * When the back-end add a 'cookie' to the socket emit, the front-end handle from here
         * @param  {object} socket the complete socket
         * @return {boolean}
         */
        save_cookies_from_socket: function(socket) {

            if (typeof socket.cookie !== "undefined") {

                if ((typeof socket.cookie.label !== "undefined") && (typeof socket.cookie.datas !== "undefined")) {

                    Cookies.set(socket.cookie.label, socket.cookie.datas);
                    return true;

                }

            }

            return false;

        },

        transmit_selector: function(scope, selector) {

            if (typeof selector !== "undefined") {

                this.selector_store[scope] = selector;

            }

        },

        /**
         * Prepare and emit a socket through the system (and transmit from front-end/front-end any selector we might want to transmit to the listener)
         * @param  {string} scope     controller.method
         * @param  {object} reference reference ids
         * @param  {object} params    parameters we want to communicate
         * @param  {object} selector  jQuery object we won't transmit to the back-end, we will store it in the selector_store and use when there's a feedback
         * @return {void}
         */
        emit_socket: function(scope, reference, params, selector) {

            this.transmit_selector(scope, selector);

            datas = this.prepare_socket(reference, params);
            Main.socket().emit(scope, datas);

        },

        /**
         * We prepare the socket before to send it
         * @param  {object} reference the reference object
         * @param  {object} params    the params that will be send to the method
         * @return {void} 
         */
        prepare_socket: function(reference, params) {

            /**
             * WITHOUT REFERENCE
             */
            if (typeof reference === 'undefined') {

                reference = {};

            }

            /**
             * WITHOUT PARAMS
             * If the last argument is avoided, it means the params are certainly empty
             */
            if (typeof params === 'undefined') {

                params = {};

            }

            // Let's return everything
            return {

                reference: reference,
                params: params

            }

        },

    }
    
    return Queries;

});