$(document).ready(function () {	
    moment.locale('pt-BR');

    $('.scrollbar').height($(window).height() - 170);

    $.template('tweetUpdateTemplate', '<div class="p-t-10 p-b-5 b-b b-grey"><div class="post"><div class="user-profile-pic-wrapper"><div class="user-profile-pic-2x white-border"><a href="https://twitter.com/${status.user.screen_name}" target="_blank" data-toggle="tooltip" data-placement="top" title="${status.user.screen_name} - ${status.user.followers_count} Seguidores"><img width="45" height="45" src="${status.user.profile_image_url_https}" alt="${status.user.screen_name}"></a></div></div><div class="info-wrapper inline"><div class="info text-black"><p>${status.text}</p><p class="muted small-text">${status.created_at} | ${rts} Retweets </p></div></div><div class="clearfix"></div></div></div>');

    $('.scrollbar').each(function () {
        var tweetsToLoad = this;
        var scroll = $(tweetsToLoad).niceScroll();

        scroll.scrollend(function () {
            if (this.scrollvaluemax <= this.scroll.y + 5) {
                var filter = $.parseJSON(getParameterByName('filter', $(tweetsToLoad).data('uri')));
                filter.skip = $(tweetsToLoad).data('skip'); 

                if ($(tweetsToLoad).data('all-load') !== true) {
                    $.getJSON('http://104.131.228.31:3000/api/Tweets?filter=' + $.stringify(filter), function (tweets) {
                        if (tweets.length > 0) {
                            for (x in tweets) {
                                tweets[x].status.created_at = moment(tweets[x].status.created_at).fromNow();
                            }

                            //TODO: Refatore isso!
                            $.tmpl('tweetUpdateTemplate', tweets).appendTo(tweetsToLoad);
                            
                            $(tweetsToLoad).data('skip', filter.skip + 10);
                        } else {
                            $(tweetsToLoad).data('all-load', true);
                        }
                    });
                }
            }
        });
    });
});

$(window).resize(function () {
    $('.scrollbar').height($(window).height() - 170);
});

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

jQuery.extend({
    stringify  : function stringify(obj) {         
        if ("JSON" in window) {
            return JSON.stringify(obj);
        }

        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';

            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") {
                        v = '"' + v + '"';
                    } else if (t == "object" && v !== null){
                        v = jQuery.stringify(v);
                    }

                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }

            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});