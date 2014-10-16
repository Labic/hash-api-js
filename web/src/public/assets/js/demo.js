$(document).ready(function () {	
    moment.locale('pt-BR', {
        relativeTime: {
            past: '%s'
        }
    });
    
    $('.scrollbar').height($(window).height() - 130);
    var autolinker = new Autolinker({truncate: 20});

    $('.info p').each(function () {
        $(this).html(autolinker.link($(this).text()));
    });

    if ($('body').hasClass('facebook')) {
        $('.readmore').expander({
            expandText: 'leia mais',
            userCollapseText: '',
            slicePoint: 200
        });
    }

    $.template('tweetUpdateTemplate', '<div class="p-t-10 p-b-5 b-b b-grey"><div class="post"><div class="user-profile-pic-wrapper"><div class="user-profile-pic-2x white-border"><img width="45" height="45" src="${status.user.profile_image_url_https}" alt="${status.user.screen_name}"></div></div><div class="info-wrapper inline"><div class="info text-black"><strong class="user-info"><a href="https://twitter.com/${status.user.screen_name}" target="_blank"> @${status.user.screen_name}</a></strong> - <span class="user-followers"> ${status.user.followers_count}Seguidores </span><p class="text"> ${status.text}</p><a href="https://twitter.com/${status.user.screen_name}/status/${status.id_str}" target="_blank" class="muted small-text">${status.created_at} | ${rts} Retweets</a></div></div><div class="clearfix"></div></div></div>');
    $.template('facebookUpdateTemplate', '<div class="p-t-10 p-b-5 b-b b-grey"><div class="post"><div class="user-profile-pic-wrapper"><div class="user-profile-pic-2x white-border"><a href="#"><img src="${Profile}", alt="${UserName}" width="45" height="45"></a></div></div><div class="info-wrapper inline"><div class="info text-black"><strong> ${UserName}</strong><p class="readmore"> ${Description}</p><p class="readmore"> ${Message}</p><p class="readmore"> ${Caption}</p><span class="muted small-text">${CreatedTime} | ${LikesCount} Likes | ${CommentsCount} Comentários | ${SharesCount} Compartilhamentos</span></div></div><div class="clearfix"></div></div></div>');

    $('.scrollbar').each(function () {
        var updatesToLoad = this;
        var scroll = $(updatesToLoad).niceScroll();

        scroll.scrollend(function () {
            if (this.scrollvaluemax <= this.scroll.y + 5) {
                var filter = $.parseJSON(getParameterByName('filter', $(updatesToLoad).data('uri')));
                filter.skip = $(updatesToLoad).data('skip'); 

                if ($(updatesToLoad).data('all-load') !== true && !$(updatesToLoad).data('loading')) {
                    $(updatesToLoad).data('loading', true);

                    if ($('body').hasClass('twitter')) {
                        var url = 'http://104.131.228.31:3000/api/Tweets?filter=' + $.stringify(filter);
                    } else {
                        var url = 'http://104.131.228.31:3000/api/FacebookPosts?filter=' + $.stringify(filter);
                    }

                    $.getJSON(url, function (updates) {
                        //TODO: Refatore isso!
                        if ($('body').hasClass('twitter')) {
                            for (x in updates) {
                                updates[x].status.created_at = moment(updates[x].status.created_at).fromNow();
                            }

                            $.tmpl('tweetUpdateTemplate', updates).appendTo(updatesToLoad);
                        } else {
                            for (x in updates) {
                                updates[x].CreatedTime = moment.unix(updates[x].CreatedTime).fromNow();
                            }

                            $.tmpl('facebookUpdateTemplate', updates).appendTo(updatesToLoad);
                        }                     

                        //$('.info p').each(function () {
                        //    $(this).html(autolinker.link($(this).text()));
                        //    $(this).html($(this).html().replace(/\n/g, '<br />'));
                        //});

                        $(updatesToLoad).find('.post').slice(-updates.length).find('.info p').each(function () {
                            $(this).html(autolinker.link($(this).text()));
                            $(this).html($(this).html().replace(/\n/g, '<br />'));
                        });

                        $(updatesToLoad).find('.post').slice(-updates.length).find('.readmore').each(function () {
                            $(this).expander({
                                expandText: 'leia mais',
                                userCollapseText: '',
                                slicePoint: 200
                            });
                        });
                        
                        $(updatesToLoad).data('skip', filter.skip + 10);
                        $(updatesToLoad).data('loading', false);   

                        if (updates.length < 10) {
                            $(updatesToLoad).data('all-load', true);
                        }
                    });
                }
            }
        });
    });

});

$(window).resize(function () {
    $('.scrollbar').height($(window).height() - 130);
});

$(document).resize(function () {
    $('.scrollbar').height($(window).height() - 130);
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