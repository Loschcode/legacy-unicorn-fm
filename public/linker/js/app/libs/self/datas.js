define(['core/dependencies/config'], function(Config)  {

  var Datas = {

        $datas: $('#unicorn-datas'),

        /**
         * Set part of the header datas in the page
         * @param {string} filter    the target to focus on
         * @param {string} label     [description]
         * @param {[type]} value [description]
         */
        set: function(filter, label, value) {

            // Check if unicorn datas exists
            if (this.$datas.length == 0) {
                return false;
            }

            // Find filter
            var $filter = this.$datas.find('#' + filter + '-datas');

            if ($filter.length == 0) {
                return false;
            }

            // Get infos object
            var infos = $filter.attr('data-infos');
            infos = JSON.parse(infos);

            // We want set a new label
            infos[label] = value;

            // Stringify
            var json = JSON.stringify(infos);

            $filter.attr('data-infos', json);

            return true;

        },

        /**
         * Get the header datas in the page
         * @param  {filter} filter   the target to focus on
         * @param  {string} label    the label to get (optional, let empty if you want to get the entire object)
         * @return {[type]}           [description]
         */
        get: function(filter, label) {

            // Check if unicorn datas exists
            if (this.$datas.length == 0) {
                return false;
            }

            // Find filter
            var $filter = this.$datas.find('#' + filter + '-datas');

            if ($filter.length == 0) {
                return false;
            }

            // Get infos object
            var infos = $filter.attr('data-infos');
            infos = JSON.parse(infos);

            if (typeof label === "undefined") {

                return infos;

            } else {

                if (label in infos) {

                    // We want get the label
                    return infos[label];

                } else {

                    return false;

                }

            }

        },

        /**
         * Reset the datas from an entire filter
         * (and filter the new_datas with what we only need in the header)
         * @param  {string} filter    the target filter (e.g. 'user', 'server')
         * @param  {object} new_datas the new datas to put inside the filter
         * @return {object} the content of the filter whatever happened to it
         */
        reset: function(filter, new_datas) {

            // Check if unicorn datas exists
            if (this.$datas.length == 0) {
                return false;
            }

            // Find filter
            var $filter = this.$datas.find('#' + filter + '-datas');

            if ($filter.length == 0) {
                return false;
            }

            var infos = $filter.attr('data-infos');
            infos = JSON.parse(infos);

            if (new_datas !== undefined) {

                new_datas_filtered = this.filter(filter, new_datas);
                new_datas_filtered_and_stringified = JSON.stringify(new_datas_filtered);

                $filter.attr('data-infos', new_datas_filtered_and_stringified);
                
                return this.filter(filter, new_datas_filtered);
            }

            return infos;

        },

        clean: function(filter) {

          this.reset(filter, '{}');

        },

        /**
         * We will filter the raw datas we received from the sockets
         * We don't need all the datas (e.g. the user encrypted password)
         * @param  {string} filter
         * @param  {object} datas the matching object we received from sockets
         * @return {object} the filtered object
         */
        filter: function(filter, datas) {

            if (filter === 'user') {

                return {

                    _id: datas._id,
                    nickname: datas.nickname,
                    raw_nickname: datas.raw_nickname,
                    role: datas.role

                }

            } else if (filter === 'server') {

                return {

                    _id: datas._id,
                    name: datas.name,
                    type: datas.type,
                    raw_name: datas.raw_name,

                }

            } else if (filter === 'player') {

              return {

                status: datas.status,
                volume: datas.volume,
                mute: datas.mute,
                last_known_position: datas.last_known_position,

              }

            } else {

              return datas;

            }

        },

    }

  return Datas;

});
