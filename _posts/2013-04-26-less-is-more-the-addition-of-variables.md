---
layout: post
title: LESS is More! The Addition of Variables
date: 2013-04-26 00:30:39.000000000 -04:00
category: coding
tags:
    - CSS
    - LESS
author: Kevin Burdett
---
I have been experimenting with [LESS](http://lesscss.org/) lately. My current needs are very basic, so I haven't even touched many of its more advanced features, but I am very impressed with it so far. It has been very quick to learn, easy to implement, and very handy! I love that it is able to accomplish some pretty powerful things in CSS with only minimal markup. Over the next few weeks (months?!) I'll have several posts on the other LESS features I find most useful (such as nesting, mix-ins, and functions).

First up... variables. Simple, fundamental, yet revolutionary! It's truly amazing how useful this feature is. I realize that adding variables to a declarative language like CSS is a slight bastardization, but sometimes pragmatism is more important than purity. Simply stated, variables are _extremely_ pragmatic. They are an important support mechanism for the DRY (Don't Repeat Yourself) principle. You can now declare variables to share things like color codes, padding and margin distances, and a multitude of other pieces of information.

# The Basics
Variables are a simple concept, so we'll jump right in... Here's a simple example.

```css
@navbarheight: 60px;
@navborder: 1px dotted black;
body {
    padding-top: @navbarheight;
}
.navbar {
    height: @navbarheight;
    border-left: @navborder;
    border-right: @navborder;
}
```

This compiles down to the following CSS.

```css
body {
    padding-top: 60px;
}
.navbar {
    height: 60px;
    border-left: 1px dotted #000000;
    border-right: 1px dotted #000000;
}
```

This is basically what you would expect out of a variable. Oddly, LESS chooses to compile out the color name and insert the color code, rather than allowing the browser to do this. I'm not sure why, but the effect is the same.

# Declarative
It is important to remember that LESS is still declarative, not imperative, even though it has variables. Thus, variables can only be given one value. Any subsequent "assignments" to that variable overwrite the value for all usages. Take a look at the example below.

```css
@indent: 2em;
.outer {
    text-indent: @indent;
}
@indent: 4em;
.inner {
    text-indent: @indent;
}
```

Which produces the following CSS.

```css
.outer {
    text-indent: 4em;
}
.inner {
    text-indent: 4em;
}
```

If you are thinking imperatively, you might expect outer to have a 2em text-indent, so it is important to remember that the variables are declarative.

# Scoping
The scoping rules in LESS align with most programming languages. As a result, the scoping will not be a surprise to anyone who has been exposed to general programming languages. The inner scope is always given precedence over the outer scope. Let's take a look at an example.

```css
@color: white;
body {
    backgound: @color;
}
.inverse {
    @color: black;
    backgound: @color;
}
p {
    backgound: @color;
}
```

The compiled CSS looks like this.

```css
body {
    backgound: #ffffff;
}
.inverse {
    backgound: #000000;
}
p {
    backgound: #ffffff;
}
```

# Arithmetic
LES gives us the ability to perform some basic arithmetic operations within the markup. Although technically not a feature exclusive to variables, these operations are only marginally useful without variables. One simply has to perform the calculation manually and store the result. However, when combined with variables, arithmetic operations begin to shine. Supports standard order of operations, which can be overridden with parenthesis. On a semantic note, all arithmetic operations must be wrapped in parenthesis. Let's take a look at an example.

```css
body {
    @header: 10%;
    @footer: 5%;
    @base-color: black;
    background-color: (@base-color + #111);
    height: (100% - @header - @footer);
}
```

Which compiles to the following CSS.

```css
body {
    background-color: #111111;
    height: 85%;
}
```

Pretty handy! It is also worth noting that LESS understands units. When performing these operations, it will convert or preserve as necessary. Though, the conversions may not return what you expect, so use with caution!

# Depth

You can also reference variables from other variables (with arithmetic too!). This makes styles highly composable. Take a look at the example.

```css
@border-width: 1px;
@wide-border: (@border-width * 2) dashed black;
body {
    border: @wide-border;
}
```

Which compiles to the following CSS.

```css
body {
    border: 2px dashed #000000;
}
```

# String Interpolation

LESS has some special handling for string variables. Using the special escape sequence "@{variable}" you can insert variable values directly into the string. LESS will interpolate the string for you and place the value in the correct location. Check out the example below.

```css
@baseUrl: "http://www.kevinburdett.com";
body {
    border-image: "@{baseUrl}/border.png";
}
```

Which compiles to the following CSS.

```css
body {
    border-image: "http://www.kevinburdett.com/border.png";
}
```

# String Literals

Sometimes, you just need to step outside the box and compose the markup yourself. LESS allows for this with string literals, denoted by the tilde (~) character. This can be used to process CSS that LESS does not understand, such as new or proprietary elements. Although quoted, LESS will not treat the literal as a string when inserted, instead it will treat it as full markup. Take a look at the nonsensical example below.

```css
@phonewidth: 480px;
@media-phone: ~"screen and (min-width: @{phonewidth})";
body {
    padding-left: 100px;
    @media @media-phone {
        padding-left: 0;
    }
}
```

Here, I have used a string literal to contain the condition portion of a media query. Once in a variable, the media query condition may be reused throughout the LESS file. I am still able to utilize string interpolation to build the literal, as you can see. Take a look at the compiled CSS below.

```css
body {
    padding-left: 100px;
}
@media screen and (min-width: 480px) {
    body {
        padding-left: 0;
    }
}
```

So now I can define my media transition points _once_ and reuse. Pragmatic indeed!

Well folks, that's it for variables. More LESS features to come!
