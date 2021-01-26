# Verkada Takehome
The following commands will build and run the project.
```
$ yarn install
$ yarn start
```

I used create-react-app to generate the webpack config, but I wasn't completely sure what
"use any basic libaries you want (except jQuery)" included, so I implemented the scroller just using
vanilla javascript.

The general approach is to maintain a buffer of rows above and below the browser window ready to be scrolled into view. Whenever the user scrolls up or down rows are rebalanced from above and below to attempt to maintain the original buffer size. This enables smooth infinite scrolling as long as the scrolling speed isn't too high.

I think a fair criticism would be that the scroller is currently coupled to the source url and
timestamp interval provided in the instructions. I debated making it more general purpose, for example
taking in the timestamp range as an argument, or providing optional layout configuration.
Given the time constraints and lacking examples of possible reuse patterns I left it as is.