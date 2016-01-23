---
layout: post
title: LESS is More! Functions and Mixins
date: 2013-06-29 12:45:32.000000000 -04:00
category: coding
tags:
    - CSS
    - LESS
author: Kevin Burdett
---
I had a chance to play a little more with LESS. This time I spent some time learning how LESS functions and Mixins work. They are very similar concepts, with a couple small differences. Both are important for maintaining the DRY principle, and are extremely powerful when coupled with the arithmetic capabilities in LESS. Let's get to it!

# Functions

LESS provides a number of functions to make life easier for CSS developers. They are called with parenthesis and can include parameters. They are used for arithmetic operations, string operations, and color manipulation. There are a bunch of them, so I won't get into all of the functions here. Take a look at the [LESS reference](http://lesscss.org/#reference) for more information about these functions.

# Mixins

While functions are handy, mixins are incredibly powerful. They are a form of user-defined functions. They can be defined with and without parenthesis for different usages.

_Without parenthesis_

*   Regular descriptor
*   Psuedo-inheritence
*   De-normalized

_With parenthesis_

*   Compile out
*   Can take parameters
*   De-normalized

# Example

Let's take a look at an example.

{% highlight css linenos %}
.emphasis (@color) {
    background-color: @color;
    color: black;
    border-color: darken(@color, 40%);
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    padding: 5px;
    margin: 5px;
}

.simple-article {
    h1 {
        font-size: 1em;
        font-weight: bold;
        border-bottom-color: black;
        border-bottom-style: solid;
        border-bottom-width: 1px;
    }
    p {
        padding-left: 5px;
    }
}

.note {
    .emphasis(#FFFACD);
    .simple-article;
}

.warning {
    .emphasis(#FFB6C1);
    .simple-article;
}
{% endhighlight %}

There is quite a bit in this example, so I'll go into it a little bit. The idea is to provide styles for small emphasis boxes for notes and warnings. I created a mixin for the emphasis definition (.emphasis), which takes in the color as a parameter. This sets up the style for the emphasis box itself. I am taking advantage of the darken function to produce the border color. Then, I created a separate mixin for the layout of the contents (.simple-article). This just sets up the basic layout within the box. Now, let's take a look at the compiled (unminified) CSS.

{% highlight css linenos %}
.simple-article h1 {
    font-size: 1em;
    font-weight: bold;
    border-bottom-color: black;
    border-bottom-style: solid;
    border-bottom-width: 1px;
}
.simple-article p {
    padding-left: 5px;
}
.note {
    background-color: #fffacd;
    color: black;
    border-color: #ffe601;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    padding: 5px;
    margin: 5px;
}
.note h1 {
    font-size: 1em;
    font-weight: bold;
    border-bottom-color: black;
    border-bottom-style: solid;
    border-bottom-width: 1px;
}
.note p {
    padding-left: 5px;
}
.warning {
    background-color: #ffb6c1;
    color: black;
    border-color: #e90023;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    padding: 5px;
    margin: 5px;
}
.warning h1 {
    font-size: 1em;
    font-weight: bold;
    border-bottom-color: black;
    border-bottom-style: solid;
    border-bottom-width: 1px;
}
.warning p {
    padding-left: 5px;
}
{% endhighlight %}

So you can see the simple-article styles remain in the output, while the emphasis styles do not. In both cases, all of the styles are fully denormalized, so .note and .warning don't share any styles. This differs a bit from SASS, which will stack the descriptors. You can decide for yourself whether this is better, or if it matters at all. In either case, you can see that all of the styles from .simple-article and .emphasis are applied to both .note and .warning, just as expected.

# The Bottom Line
Another way that LESS helps with composing styles. Functions are very handy and Mixins open up a multitude of possibilities. Take a look at [LESS Hat](http://lesshat.madebysource.com) to turn up the awesome :)
