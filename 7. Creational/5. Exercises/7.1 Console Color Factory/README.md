# Console Color Factory

## Applying Color Console.

Below you can find colors reference of text to command when running node.js application:

```javascript
console.log("\x1b[36m%s\x1b[0m", "I am cyan"); //cyan
console.log("\x1b[33m%s\x1b[0m", stringToMakeYellow); //yellow
```

Note `%s` is where in the string (the second argument) gets injected. `\x1b[0m` resets the terminal color so it doesn't continue to be the chosen color anymore after this point.

### Colors reference

```javascript
Reset = "\x1b[0m";
Bright = "\x1b[1m";
Dim = "\x1b[2m";
Underscore = "\x1b[4m";
Blink = "\x1b[5m";
Reverse = "\x1b[7m";
Hidden = "\x1b[8m";

FgBlack = "\x1b[30m";
FgRed = "\x1b[31m";
FgGreen = "\x1b[32m";
FgYellow = "\x1b[33m";
FgBlue = "\x1b[34m";
FgMagenta = "\x1b[35m";
FgCyan = "\x1b[36m";
FgWhite = "\x1b[37m";

BgBlack = "\x1b[40m";
BgRed = "\x1b[41m";
BgGreen = "\x1b[42m";
BgYellow = "\x1b[43m";
BgBlue = "\x1b[44m";
BgMagenta = "\x1b[45m";
BgCyan = "\x1b[46m";
BgWhite = "\x1b[47m";
```

EDIT:

For example, `\x1b[31m` is an escape sequence that will be intercepted by your terminal and instructs it to switch to the red color. In fact, `\x1b` is the code for the non-printable control character escape. Escape sequences dealing only with colors and styles are also known as ANSI escape code and are standardized, so therefore they (should) work on any platform.

Wikipedia has a nice comparison of how different terminals display colors
<a href="https://en.wikipedia.org/wiki/ANSI_escape_code#Colors" target="_blank">Wiki Page</a>
