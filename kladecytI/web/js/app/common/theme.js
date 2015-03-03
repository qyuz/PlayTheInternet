(function() {
    var themes = ['day', 'night'];
    var sTheme = localStorage.getItem('theme');
    var currTheme = themes.indexOf(sTheme) >= 0 ? sTheme : themes[0];
    document.getElementsByTagName('html')[0].id = currTheme;
})()
