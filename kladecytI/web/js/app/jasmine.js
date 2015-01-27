define(["sitehandlers", "pti-playlist", "cparse"], function (a, Playlist, c) {
    window.compiledPlayTheInternetParse = playTheInternetParse
    require(["jasmine", "parse"], function () {
        require(["jasmine-html"], function () {
            require(["jasmine-runner"], function () {
                $(document).ready(function () {
                    Playlist()
                    function typeIds(text) {
                        return _.stringToArray(playTheInternetParse(text)).map(_.typeId)
                    }
                    var youtube = typeIds($('#youtube').val())
                    var soundcloud = typeIds($('#soundcloud').val())
                    var vimeo = typeIds($('#vimeo').val())

//--- SPECS -------------------------
                    describe("youtube", function () {
                        it("http://www.youtu.be%2F00000000000 [duplication test]", function () {
                            expect(youtube[1]).not.toEqual({type:"y", id:"00000000000"});
                        });
                        it("http://www.youtube.com/watch?v=00000000000", function () {
                            expect(youtube[0]).toEqual({type:"y", id:"00000000000"});
                        });
                        it("http://www.youtu.be\u00252F11111111111", function () {
                            expect(youtube[1]).toEqual({type:"y", id:"11111111111"});
                        });
                        it("watch?v=22222222222", function () {
                            expect(youtube[2]).toEqual({type:"y", id:"22222222222"});
                        });
                        it("http://www.youtube.com/embed/33333333333", function () {
                            expect(youtube[3]).toEqual({type:"y", id:"33333333333"});
                        });
                        it("http://www.youtube.com/v/44444444444", function () {
                            expect(youtube[4]).toEqual({type:"y", id:"44444444444"});
                        });
                        it("http://youtube.googleapis.com/v/C2V-Le8N7UU&source=uds", function () {
                            expect(youtube[5]).toEqual({type:"y", id:"C2V-Le8N7UU"});
                        });
                        it("[link: http://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3DGbIIBFxrqek%26feature%3Dshare&a=VWFTk5fDhcpcpLcX68GPOg] [regex: watch(([^ \'\'<>]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))]", function () {
                            expect(youtube[6]).toEqual({type:"y", id:"GbIIBFxrqek"});
                        });
                        it("[link: http%3A%2F%2Fi1.ytimg.com%2Fvi%2FaOJnqPqqWxo%2Fmaxresdefault.jpg%3Ffeature%3Dog&amp;jq=100] [regex: ytimg.com\u0025Fvi\u0025F]", function () {
                            expect(youtube[7]).toEqual({type:"y", id:"aOJnqPqqWxo"});
                        });
                    });
                    describe("soundcloud", function () {
                        it("https://soundcloud.com/user-name/sets/000000", function () {
                            expect(soundcloud[0]).toEqual({type:"s", id:"user-name/sets/000000"});
                        });
                        it('a class="soundTitle__title sc-link-dark" href="/user-name/1111111111"', function () {
                            expect(soundcloud[1]).toEqual({type:"s", id:"/user-name/1111111111"});
                        });
                        it('soundcloud.com/pecavi/sets/pecavi [duplicate check and double backward slash remove]', function () {
                            expect(soundcloud[2]).toEqual({type:"s", id:"pecavi/sets/pecavi"});
                        });
                        it("soundcloud.com%2Fkarina-zukova%2Fhero-finished-output-stereo&amp;h=JAQHJpjwY&amp;s=1", function () {
                            expect(soundcloud[3]).toEqual({type:"s", id:"karina-zukova/hero-finished-output-stereo"});
                        });
                        it("soundcloud.com/karina-zukova/hero-finished-output-stereo", function () {
                            expect(soundcloud[4]).not.toEqual({type:"s", id:"karina-zukova/hero-finished-output-stereo"});
                        });
                        it("soundcloud.com/dubstep/runaway-by-aether-amber-noel%3Ffb_action_ids%3D548456968562412%26fb_action_types%3Dog.likes%26fb_source%3Dother_multiline%26action_object_map%3D%255B456761251109443%255D%26action_type_map%3D%255B%2522og.likes%2522%255D%26action_ref_map%3D%255B%255D%26fb_collection_id%3D10151187543611799%26ref%3Dprofile", function () {
                            expect(soundcloud[6]).toEqual({type:"s", id:"dubstep/runaway-by-aether-amber-noel"});
                        });
                        it("https%3A%2F%2Fsoundcloud.com%2Fthehouseofdisco%2Fjason-malan-back-to-the-sand%3Futm_source%3Dsoundcloud%26utm_campaign%3Dshare%26utm_medium%3Dfacebook&amp;h=4AQHkHPJT&amp;s=1", function () {
                            expect(soundcloud[7]).toEqual({type:"s", id:"thehouseofdisco/jason-malan-back-to-the-sand"});
                        });
                        it('[link :https://soundcloud.com/.../on-the-block-prod-by-boi-ape] [regex: ([^.][^\s,?"=&#<]+)]', function () {
                            expect(soundcloud[8]).not.toEqual({type:"s", id:".../on-the-block-prod-by-boi-ape"});
                        });
                    });
                    describe("vimeo", function () {
                        it("http://vimeo.com\\/64530002 [duplication test]", function () {
                            expect(vimeo[1]).not.toEqual({type:"v", id:"64530002"});
                        });
                        it("http://vimeo.com/64530002", function () {
                            expect(vimeo[0]).toEqual({type:"v", id:"64530002"});
                        });
                        it("[link: http://player.vimeo.com/video/58994852?title=0&byline=0&portrait=0] [regex: (video\/)?]", function () {
                            expect(vimeo[1]).toEqual({type:"v", id:"58994852"});
                        });
                        it('[http://www.vimeo.com/moogaloop.swf?clip_id=79179138&server=www.vimeo.com&fullscreen=1&show_title=1&show_byline=1&show_portrait=0&color="] [regex: ((video\/)|(moogaloop.swf\?clip_id=))?]', function () {
                            expect(vimeo[2]).toEqual({type:"v", id:"79179138"});
                        });
                    });

                    function simplifyParse(func) {
                        return func.toString().replace(/[ "'\r\n]/g, '')
                    }

                    describe("playTheInternetParse", function () {
                        it("playTheInternetParse function equal", function () {
                            expect(simplifyParse(playTheInternetParse)).toEqual(simplifyParse(compiledPlayTheInternetParse))
                        })
                    })

                    var jasmineEnv = jasmine.getEnv();
                    jasmineEnv.updateInterval = 1000;
//
//                    var htmlReporter = new jasmine.HtmlReporter();
//
//                    jasmineEnv.addReporter(htmlReporter);
//
//                    jasmineEnv.specFilter = function(spec) {
//                        return htmlReporter.specFilter(spec);
//                    };
//
//                    var currentWindowOnload = window.onload;
//
//                    window.onload = function() {
//                        if (currentWindowOnload) {
//                            currentWindowOnload();
//                        }
//                        execJasmine();
//                    };
//
                    function execJasmine() {
                        jasmineEnv.execute();
                    }
                    execJasmine()
                })
            })

        })
    })
})
