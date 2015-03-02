function PTITemplates() {
}
PTITemplates.prototype.ptiElement = _.template('<div id="<%= id %>" class="<%= elementClass %>"></div>')

PTITemplates.prototype.YoutubeRawTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/youtube.jpg"><div class="pti-action"><%=PTITemplates.prototype.AddAction()%><%=PTITemplates.prototype.PlayAction()%></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.YoutubeCompleteTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-action"><%=PTITemplates.prototype.AddAction()%><%=PTITemplates.prototype.PlayAction()%></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
PTITemplates.prototype.YoutubeErrorTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/youtube-error.png"><div class="pti-action"><%=PTITemplates.prototype.AddAction()%><%=PTITemplates.prototype.PlayAction()%></div></div><span class="error-text"><b><a href="http://www.youtube.com/watch?v=<%=id%>" target="_blank"><%=error%></a></b></span></div>');

PTITemplates.prototype.SoundCloudRawTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/sc.jpeg"><div class="pti-action"><%=PTITemplates.prototype.AddAction()%><%=PTITemplates.prototype.PlayAction()%></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.SoundCloudPlayerTemplate = _.template('<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/150704841" width="100%" height="465" scrolling="no" frameborder="no"> </iframe>')

PTITemplates.prototype.VimeoRawTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/vimeo.jpg"><div class="pti-action"><%=PTITemplates.prototype.AddAction()%><%=PTITemplates.prototype.PlayAction()%></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.VimeoCompleteTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-action"><%=PTITemplates.prototype.AddAction()%><%=PTITemplates.prototype.PlayAction()%></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
PTITemplates.prototype.VimeoPlayerTemplate = _.template('<iframe id="vimeo" src="http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')

PTITemplates.prototype.PlaylistGroupHeaderTemplate = _.template('<label class="pti-droppable-target"><%=name%></label>')

PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing = _.template('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-danger"><b>Please refresh(F5) currently open tab</b><br>(<%=href%>)</div> </div> </div> </div>')
PTITemplates.prototype.ParsePlayTheInternetParseNothingFound = _.template('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-warning"><b>Nothing found on</b><br><%=href%></div> </div> </div> </div>')

PTITemplates.prototype.PtilistElement = _.template('<div id="<%= id %>" class="<%= elementClass %>"></div>')
PTITemplates.prototype.PlaylistsVideoElement = _.template('<div>\n    <div class="pti-sortable-handler image-div"><img src="<%= typeof thumbnail !== " undefined" && thumbnail ? thumbnail\n        : "/favicon.ico" %>">\n        <div class="pti-action"><%=PTITemplates.prototype.FolderOpen()%></div>\n    </div>\n    <div class="pti-playlists-content">\n        <div class="pti-playlists-info"><input type="text" class="pti-name pti-clickable" value="<%= name %>"/> \n            <% if (id.match(/^sPlaylist/)) { %>\n                <% if (typeof source !== "undefined" && source == "sync") { %>\n                    <div class="pti-status pti-main-text" title="Last synchronized at <%= new Date(updated).toLocaleTimeString() %> on <%= new Date(updated).toDateString() %>">S</div>\n                <% } else if (typeof source !== "undefined" && source == "local") { %>\n                    <div class="pti-status pti-error-text" title="This playlist is removed from synchronization and is available only on this PC.">L</div>\n                <% } else { %>\n                    <div class="pti-status pti-warning-text" title="Scheduled for synchronization.">U</div>\n                <% } %>\n            <% } %>\n            <div class="pti-count"><%= data.length %></div>\n        </div>\n        <div class="pti-playlists-buttons">\n            <div class="pti-play-this pti-clickable" title="Play this playlist in &quot;Playing&quot; tab.">Play this\n            </div>\n            <div class="pti-add-all pti-clickable"\n                 title="Add all songs from this playlist to current &quot;Playing&quot; playlist.">Add All\n            </div>\n            <div class="pti-remove-playlist">\n                <div class="pti-remove-playlist-dialog pti-clickable">Remove Playlist</div>\n                <div class="pti-remove-playlist-yes pti-clickable temp-display-none-important">Yes</div>\n                <div class="pti-remove-playlist-no pti-clickable temp-display-none-important">No</div>\n            </div>\n        </div>\n    </div>\n</div>')

PTITemplates.prototype.PtiElement = _.template('<div id="<%= id %>" class="<%= elementClass %>"></div>')
PTITemplates.prototype.PlaylistsElement = _.template('<div>\n    <div class="pti-sortable-handler image-div"><img src="">\n        <div class="pti-action"><%=PTITemplates.prototype.FolderOpen()%></div>\n    </div>\n    <div class="pti-playlists-content">\n        <div class="pti-playlists-info"><input type="text" class="pti-name pti-clickable" value=""/> \n            <% if (id.match(/^sPlaylist/)) { %>\n                <div class="pti-status" title=""></div>\n            <% } %>\n            <div class="pti-count"></div>\n        </div>\n        <div class="pti-playlists-buttons">\n            <div class="pti-play-this pti-clickable" title="Play this playlist in &quot;Playing&quot; tab.">Play this\n            </div>\n            <div class="pti-add-all pti-clickable"\n                 title="Add all songs from this playlist to current &quot;Playing&quot; playlist.">Add All\n            </div>\n            <div class="pti-remove-playlist">\n                <div class="pti-remove-playlist-dialog pti-clickable">Remove Playlist</div>\n                <div class="pti-remove-playlist-yes pti-clickable temp-display-none-important">Yes</div>\n                <div class="pti-remove-playlist-no pti-clickable temp-display-none-important">No</div>\n            </div>\n        </div>\n    </div>\n</div></div>')

PTITemplates.prototype.FolderOpen = _.template('<svg class="pti-action-open" viewBox="-5 -3 38 28" version="1.1"><path d="m 4.3435431,6.6512019 c -0.2,0.6 -4.4999997,11.2000001 -4.4999997,11.2000001 V 2.9512019 c 0,-0.5 0.5,-1 1,-1 h 1.3 l 0.3,-1.1000001 c 0.2,-0.5 0.8,-0.9 1.2999997,-0.9 H 8.743543 c 0.5,0 1.1,0.4 1.3,0.9 l 0.3,1.1000001 h 9.3 c 0.5,0 1,0.5 1,1 v 3 H 5.1435431 c -0.1,0 -0.5,0.1 -0.8,0.7 z m 24.4999999,0.3 H 6.8435431 c -0.5,0 -1.2,0.4 -1.4,0.9 L 0.1435434,20.951202 c -0.2,0.5 0.1,0.9 0.6,0.9 H 22.743543 c 0.5,0 1.2,-0.4 1.4,-0.9 l 5.3,-13.1000001 c 0.2,-0.5 -0.1,-0.9 -0.6,-0.9 z"></path></svg>')
PTITemplates.prototype.PlayAction = _.template('<svg class="pti-action-play" viewBox="0 0 100 100" version="1.1"><polygon points="0,0 100,50 0,100"/></svg>')
PTITemplates.prototype.AddAction = _.template('<svg class="pti-action-add" viewBox="0 0 100 100" version="1.1"><polygon points="0,0 100,50 0,100 50,50"/></svg>')

PTITemplates.prototype.PlayerNav = _.template('<svg viewBox="0 0 24 16" version="1.1"><path d="M 24.1,2.0621786 V 14.062183 c 0,0.3 -0.2,0.4 -0.4,0.2 L 17.1,8.9621782 v 5.6000048 c 0,0.8 -0.7,1.5 -1.5,1.5 h -14 c -0.8,0 -1.5,-0.7 -1.5,-1.5 V 1.5621786 C 0.1,0.76217878 0.8,0.06217878 1.6,0.06217878 h 14 c 0.8,0 1.5,0.7 1.5,1.49999982 v 5.5999996 l 6.6,-5.2999996 c 0.2,-0.2 0.4,-0.1 0.4,0.2 z"/></svg>')
PTITemplates.prototype.PlaylistNav = _.template('<svg viewBox="0 0 28 23.5" version="1.1"><path d="M 25.169858,11.040163 C 25.058913,9.6126412 26.611511,8.0890447 25.236275,6.8110641 24.171311,5.8806919 22.317408,5.4449538 21.052519,5.5668476 20.9274,7.013844 21.017159,8.4923258 20.989749,9.9542182 c 0,3.1786078 0,6.3572158 0,9.5358238 -0.67909,3.030693 -4.270846,4.492103 -7.100681,3.869906 -1.46445,-0.322641 -2.813834,-1.83188 -2.254743,-3.381294 0.56438,-1.961592 2.594728,-3.017323 4.459795,-3.418781 0.971256,0.299301 2.367662,-0.08259 1.90984,-1.339948 0,-4.839479 0,-9.6789575 0,-14.51843651 0.898882,-1.31314844 2.975244,-0.65158488 3.372144,0.66350621 2.045564,1.1005146 4.807167,1.1706248 6.181943,3.2859273 1.235172,2.3035734 -0.206221,5.2562458 -2.388193,6.389241 z M 0.58685945,8.0578534 c 5.14219235,0 10.28438555,0 15.42657755,0 0,-0.9941034 0,-1.9882067 0,-2.9823101 -5.142192,0 -10.2843852,0 -15.42657755,0 -0.82238232,0.699004 -0.8044095,2.2840997 0,2.9823101 z m 0,5.9646196 c 5.14219235,0 10.28438555,0 15.42657755,0 0,-0.994103 0,-1.988207 0,-2.98231 -5.142192,0 -10.2843852,0 -15.42657755,0 -0.822395,0.698999 -0.80439126,2.284144 0,2.98231 z M 10.639017,17.004784 c -3.3507195,0 -6.7014385,0 -10.05215755,0 -1.06427966,0.83905 -0.77045234,3.427507 0.96209375,2.971386 2.532319,0.02701 5.0647874,0.002 7.5971689,0.01092 0.1034733,-1.140617 0.7488508,-2.146112 1.4928949,-2.98231 z"/></svg>')
PTITemplates.prototype.AlbumsNav = _.template('<svg viewBox="0 0 28.5 18" version="1.1"><path id="path3975" d="m0.8896,2.0009v14c-0.97821,0.04912-1.0625-1.0095-1-1.7323,0.012192-3.828-0.02442-7.6573,0.018359-11.483,0.064598-0.4762,0.51207-0.8052,0.98164-0.7848z"/> <path id="path3977" d="m26.89,2.0009v14c0.97821,0.04912,1.0625-1.0095,1-1.7323v-11.268c0.01675-0.53871-0.4672-1.0073-1-1z"/> <path id="path3979" d="m2.8896,1.0009c0.2943,0.10561,1.029-0.22922,1,0.19972v15.8c-0.6702-0.039-1.6086,0.203-1.9281-0.591-0.1528-1.143-0.0347-2.316-0.0719-3.472,0.0122-3.7169-0.0244-7.4363,0.0184-11.152,0.0646-0.4762,0.512-0.80524,0.9816-0.7848z"/> <path id="path3981" d="m24.89,1.0009c-0.2943,0.10561-1.029-0.22922-1,0.19972v15.8c0.6702-0.03855,1.6086,0.20284,1.9281-0.59062,0.15273-1.1428,0.03468-2.3161,0.07188-3.4718v-10.938c0.01675-0.53871-0.4672-1.0073-1-1z"/> <path id="path3983" d="m21.89,0.00087069h-16c-0.91152,0.031983-1.0824,1.0095-1,1.7323v15.268c0.031983,0.91152,1.0095,1.0824,1.7323,1h15.268c0.91152-0.03198,1.0824-1.0095,1-1.7323v-15.268c-0.01313-0.51627-0.48373-0.98687-1-1zm-3,12c-0.04297,1.3621-1.742,1.8784-2.8766,1.6281-1.3451-0.16973-1.7249-1.9404-0.54238-2.6219,0.51988-0.74889,1.9957-0.441,2.3189-0.80595v-4.2004c-2,0.46667-4,0.93333-6,1.4-0.01501,2.0064,0.03051,4.0156-0.02366,6.0202-0.25785,1.4953-2.4059,2.3155-3.5931,1.3599-1.1056-0.986,0.0693-2.527,1.2171-2.78,0.75392-0.18665,1.6926,0.16564,1.4-0.89889,0.0125-1.9875-0.025-3.978,0.01875-5.9637,0.17656-0.52203,0.87612-0.4078,1.3138-0.59908,2.1558-0.54614,4.3116-1.0923,6.4674-1.6384,0.51993,0.22016,0.21949,0.94129,0.3,1.3986v7.7016z"/></svg>')
PTITemplates.prototype.AlbumsSyncNav = _.template('<svg viewBox="0 0 28.5 18" version="1.1">   <path id="path3975" d="m6.0312,0c-0.91152,0.031983-1.0824,0.9959-1,1.7188v15.281c0.031983,0.91152,0.9959,1.0824,1.7188,1h15.281c0.91152-0.03198,1.0824-0.9959,1-1.7188v-15.281c-0.01313-0.51627-0.48373-0.98687-1-1zm-2.4062,0.96875c-0.2168,0.01689-0.4466,0.08405-0.5938,0.03125-0.46957-0.020439-0.9354,0.30505-1,0.78125-0.042766,3.7161,0.012185,7.4389,0,11.156,0.037193,1.1557-0.090232,2.326,0.0625,3.4688,0.31956,0.79347,1.2673,0.5552,1.9375,0.59375v-15.812c0.0146-0.21497-0.1894-0.23614-0.4062-0.21925zm20.781,0c-0.21684-0.016889-0.38952,0.004279-0.375,0.21875v15.812c0.6702-0.03855,1.5867,0.19972,1.9062-0.59375,0.15273-1.1428,0.05655-2.313,0.09375-3.4688v-10.938c0.01675-0.53871-0.4672-1.0073-1-1-0.14715,0.052806-0.40816-0.014361-0.625-0.03125zm-23.375,1.0312c-0.46957-0.020439-0.9354,0.30505-1,0.78125-0.042775,3.8261,0.012192,7.6726,0,11.5-0.06251,0.72285,0.021789,1.7679,1,1.7188zm26,0,0,14c0.97821,0.04912,1.0625-0.9959,1-1.7188v-11.281c0.01675-0.53871-0.4672-1.0073-1-1zm-14.219,1.625c1.4956,0.046295,2.9916,0.77206,3.8438,2.0312,0.15988,0.89756,0.9501,0.72113,1.625,0.59375,0.95371-0.00215,1.9199,0.3852,2.5938,1.0625,1.7454,1.7011,1.2815,5.1382-0.80804,6.3973-2.12,1.207-11.475,0.327-12.473,0.165-1.5224-0.449-2.1925-2.469-1.3438-3.781,0.2657-0.7655,1.1974-0.7637,1.5938-1.344-0.1129-1.7749,0.8765-3.5719,2.4062-4.4688,0.775-0.4744,1.665-0.684,2.562-0.6562z" transform="translate(-0.12610646,8.7069e-4)"/></svg>')
PTITemplates.prototype.SynchronizedNav = _.template('<svg viewBox="0 0 24.5 22" version="1.1"><path d="m 12.14813,10.0105 c -0.973996,0.312743 -1.541261,1.726458 -2.366831,2.454347 -0.9110653,1.081877 -1.8221159,2.163766 -2.733169,3.245653 0.2260033,0.624362 1.2271056,0.175913 1.8096133,0.3 0.3790769,0.105499 1.2511597,-0.284496 1.0923044,0.361776 0.0068,1.809092 -0.02588,3.618502 0.018382,5.427324 0.898799,0.458578 2.03908,0.09265 3.039226,0.213062 1.222626,0.304237 0.925315,-1.072955 0.940464,-1.848317 0,-1.384515 0,-2.76903 0,-4.153545 0.864798,-0.185628 2.513609,0.386397 2.863965,-0.316986 -1.525987,-1.907347 -3.11252,-3.787882 -4.663955,-5.683314 z" /> <path d="M 18.94813,4.1105 C 17.919474,4.3046444 16.696358,4.5534961 16.452673,3.1854713 14.374586,0.11474498 9.8425826,-0.81187294 6.6920398,1.1165131 4.3605324,2.4834381 2.8761238,5.1996776 3.04813,7.9049 2.4439629,8.7893726 1.0293337,8.8020574 0.62441705,9.9683803 -0.66920838,11.968637 0.35110529,15.025685 2.6713604,15.7098 c 0.9867587,0.151731 2.5894089,0.735836 2.5914147,-0.698965 0.8993869,-1.235613 2.0128087,-2.309469 2.984578,-3.492841 0.8772067,-0.958229 1.6713533,-2.0156245 2.6335189,-2.8823495 1.286529,-0.7467878 2.507647,0.3980154 3.181818,1.4107945 1.40405,1.652664 2.936772,3.222708 4.238219,4.946334 0.164098,1.892906 2.486627,0.754198 3.491504,0.21593 3.184811,-1.919084 3.754744,-6.8894424 1.094424,-9.4821296 C 21.859745,4.69426 20.40174,4.1072289 18.94813,4.1105 z" /></svg>')
PTITemplates.prototype.TextNav = _.template('<svg viewBox="0 0 22 24" version="1.1"><path d="m16.211,17.495c-2.6244-0.014-5.2491,0.027-7.8734-0.02,0.03699-1.2855-0.91365-3.559,0.91952-3.9453,1.3382-0.18856,2.6901,0.11102,4.0331-0.0598,0.98418-0.10294,3.3543,0.64948,2.8187-1.0518-0.22157-1.2748,1.0629-1.8267,1.7345-0.7038,1.4848,1.2439,2.9479,2.5139,4.455,3.731-1.5449,1.7747-3.6059,2.9838-5.2542,4.6495-1.4938,0.44412-0.63856-1.9261-0.83325-2.5999zm1.2,4.1c-0.92358,0.90632-2.27-0.19718-2.3051-1.2764,0.42434-1.0733-0.2643-2.24-1.5602-1.9322-1.8927,0.20874-3.8025,0.12533-5.7002,0.03081-1.2397-1.0755-0.29438-2.8158-0.7308-4.1613-0.08543-1.5669,1.7273-2.1102,2.9894-1.7941,1.7014,0.07668,3.4046,0.01231,5.1068,0.03085-0.04741-1.1414-0.25659-2.8068,1.0531-3.3282,1.2173-0.75053,2.1048,2.0399,3.017,0.84798,0.26434-1.0225,0.27633-3.1735-1.3399-2.7201h-5.13c-1.0402-0.84092-0.24796-2.2626-0.5-3.3673v-3.6327h-11.5c-1.0402,0.84092-0.24796,2.2626-0.5,3.3673v20.132c0.8409,1.0402,2.2626,0.248,3.3673,0.5h15.132c1.0402-0.84092,0.24796-2.2626,0.5-3.3673-0.05623-0.37797,0.20003-1.455-0.3563-0.71352-0.51506,0.46063-1.0315,0.91977-1.5435,1.3837zm-3.7-15.1h5.5l-6-6c0.0204,1.899-0.04109,3.7988,0.0312,5.6972,0.07226,0.18506,0.26804,0.31888,0.4688,0.3028z"/></svg>')
PTITemplates.prototype.ParseNav = _.template('<svg viewBox="0 0 21 18" version="1.1"><path d="m 18,14.312183 c 0.06635,2.171954 -1.969916,4.024092 -4.109877,3.9 -3.365031,-0.0035 -6.7302388,0.007 -10.0951584,-0.0052 C 1.6289367,18.148901 -0.18041519,16.089285 0,13.93749 0.00347131,10.627397 -0.00695324,7.3171259 0.00523071,4.0071436 0.0632823,1.8411158 2.1228982,0.03176397 4.274693,0.21217916 c 3.3099998,0.003281 6.620158,-0.006572 9.930059,0.004944 C 16.246248,0.25550895 17.973778,2.0912655 18,4.112179 17.212524,3.4465867 16.457961,2.715803 15.466797,2.3574427 14.780793,2.0865466 14.019466,2.2622053 13.296903,2.212179 c -3.4323009,0 -6.864602,0 -10.296903,0 -0.8405903,0.024057 -1.0888349,0.9120007 -1,1.6043247 0,3.7985598 0,7.5971193 0,11.3956793 0.024057,0.84059 0.9120007,1.088835 1.6043247,1 3.7985584,0 7.5971173,0 11.3956753,0 1.09294,-0.263621 1.968677,-0.993143 2.790424,-1.722666 C 17.860283,14.430405 17.930141,14.371294 18,14.312183 z M 20.6,8.912179 C 18.813845,7.4523365 17.059143,5.949653 15.253125,4.5168665 14.81274,4.6579444 15.069184,5.3077303 15,5.6911968 c 0,0.5403274 0,1.0806548 0,1.6209822 -2.5,0 -5,0 -7.5,0 -0.6952265,0.051306 -0.4574209,0.8520809 -0.5,1.3240791 0.020934,0.7927573 -0.043793,1.5929779 0.035938,2.3806119 0.2932284,0.479126 0.9280272,0.234875 1.3980189,0.295313 2.1886816,0 4.3773626,0 6.5660436,0 0.02114,0.894425 -0.04344,1.796707 0.03438,2.685937 0.370342,0.262093 0.70405,-0.368316 1.036655,-0.553732 1.509657,-1.277402 3.019313,-2.554804 4.52897,-3.8322066 0.130988,-0.1944149 0.261774,-0.5478628 0,-0.7000024 z"/></svg>')
PTITemplates.prototype.SettingsNav = _.template('<svg viewBox="0 0 24 24" version="1.1"><path d="m 23.836268,13.581328 c -0.03656,-0.975133 0.563498,-2.479622 -0.395691,-3.09892 C 22.505807,10.248715 21.571038,10.015022 20.636268,9.781329 20.633597,8.8866099 19.591075,8.1112295 19.947943,7.2326957 20.444051,6.4155734 20.94016,5.5984512 21.436268,4.781329 20.677666,4.1125567 20.00782,2.6215722 18.887635,2.7930036 18.070512,3.2891121 17.25339,3.7852205 16.436268,4.281329 15.793047,3.6634614 14.515972,3.8490539 14.137348,2.9856382 13.903654,2.0508685 13.669961,1.1160987 13.436268,0.18132894 12.461135,0.21789012 10.956646,-0.38216873 10.337348,0.57701971 10.103655,1.5117895 9.8699614,2.4465592 9.6362682,3.381329 8.7415491,3.3839997 7.9661687,4.4265222 7.0876349,4.0696544 6.2705126,3.5735459 5.4533904,3.0774375 4.6362682,2.581329 3.9674959,3.3399305 2.4765114,4.0097772 2.6479428,5.1299623 3.1440513,5.9470846 3.6401597,6.7642068 4.1362682,7.581329 3.5184006,8.2245495 3.7039931,9.5016248 2.8405774,9.8802493 1.9058077,10.113942 0.97103789,10.347635 0.03626813,10.581328 c 0.03656118,0.975133 -0.56349767,2.479622 0.39569076,3.09892 0.93476981,0.233694 1.86953951,0.467387 2.80430931,0.70108 0.00267,0.894719 1.0451932,1.6701 0.6883254,2.548633 -0.4961085,0.817123 -0.9922169,1.634245 -1.4883254,2.451367 0.7586015,0.668772 1.4284482,2.159757 2.5486333,1.988325 0.8171223,-0.496108 1.6342445,-0.992217 2.4513667,-1.488325 0.6432205,0.617868 1.9202957,0.432275 2.2989203,1.295691 0.2336932,0.93477 0.4673865,1.869539 0.7010795,2.804309 0.975133,-0.03656 2.479622,0.563498 3.09892,-0.395691 0.233694,-0.93477 0.467387,-1.869539 0.70108,-2.804309 0.894719,-0.0027 1.6701,-1.045193 2.548633,-0.688325 0.817123,0.496108 1.634245,0.992217 2.451367,1.488325 0.668772,-0.758602 2.159757,-1.428448 1.988325,-2.548633 -0.496108,-0.817123 -0.992217,-1.634245 -1.488325,-2.451367 0.617868,-0.643221 0.432275,-1.920296 1.295691,-2.29892 0.93477,-0.233694 1.869539,-0.467387 2.804309,-0.70108 z m -11.8,2.6 C 9.323468,16.286187 7.0924294,13.255913 8.0310165,10.695849 8.7545037,8.281132 11.877721,6.9792538 14.06546,8.2998347 c 2.039247,1.0849527 2.830658,3.9608343 1.518845,5.8948093 -0.735379,1.213378 -2.122161,2.014735 -3.548037,1.986684 z"/></svg>')
PTITemplates.prototype.HelpNav = _.template('<svg viewBox="0 0 24.5 24.5" version="1.1"><path d="m 14.219942,19.686784 c -0.627177,1.019303 -2.098555,0.230246 -3.096666,0.520039 -1.5150518,-0.0056 -0.699445,-1.989175 -0.904234,-2.951862 -0.2514583,-1.622529 1.786994,-0.905551 2.730168,-1.068692 0.900705,-0.275879 1.476005,0.424218 1.270692,1.259799 2.7e-5,0.746892 -5.3e-5,1.493891 4e-5,2.240716 z m -2,-19.7000001 C 6.4109066,-0.15757072 0.96155814,4.5094843 0.16193089,10.25834 -0.83805531,15.900015 2.7809359,21.909528 8.2110213,23.715672 13.427733,25.631907 19.77086,23.351283 22.608689,18.578335 25.71067,13.74137 24.701737,6.7419987 20.295485,3.0288446 18.092446,1.0799516 15.163325,-0.03307224 12.219942,-0.0132161 z m 2.8,12.0000001 c -1.56335,0.20322 -0.636577,3.22236 -2.566282,2.585822 -0.913056,0.146693 -2.147498,0.115551 -1.741818,-1.165655 0.05707,-1.453251 1.114473,-2.571924 2.322878,-3.202917 C 13.927292,9.3935089 13.176679,7.5554221 11.91398,7.9675279 10.815949,8.2145687 10.75552,10.321465 9.2882624,9.6867839 8.2811044,9.814647 6.8833263,9.8109599 7.4288551,8.4164004 7.761316,6.5690373 9.4938133,5.2304937 11.330052,5.1206816 c 2.161423,-0.3051704 4.849365,0.7251954 5.319873,3.0733807 0.399387,1.4649512 -0.01816,3.2888667 -1.629983,3.7927217 z"/></svg>')

typeof exports !== 'undefined' && typeof module  !== 'undefined' && (exports = module.exports = PTITemplates)