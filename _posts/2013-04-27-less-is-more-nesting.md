---
layout: post
title: LESS is More! Nesting
date: 2013-04-27 16:59:55.000000000 -04:00
category: coding
tags:
    - CSS
    - LESS
author: Kevin Burdett
---
I would like to talk a bit about another great [LESS](http://lesscss.org/) feature, nesting. For me, one of the most difficult things about working with CSS is organization. Physically locating descriptors that are logically related is next to impossible. The trivial cases are, well, trivial. But once you begin getting a few levels deep, it becomes difficult to keep things straight. They seem to silently creep away from one another within my CSS files over time. After a while, they become nearly impossible to locate. I have resorted to comment blocks and artificially splitting to multiple files, but these aren't true solutions. This scattering is a severe detriment to refactorability. LESS enables you to nest these descriptors, grouping them together. This improves organization and refactorability. Also, this means I don't have to repeat the leading descriptors, reinforcing the DRY principle. Take a look at this CSS example, representing a basic (and fictional) article style:

{% highlight css linenos %}
article {
    border: 1px dashed black;
}
article header {
    border-bottom: 1px solid black;
    margin-bottom: 5px;
}
article header h1 {
    font-size: 125%;
    font-weight: bold;
}
article .body {
    padding-left: 10px;
}
article .body p {
    color: darkgray;
}
    article footer {
    text-align: right;
}
{% endhighlight %}

This seems pretty straightforward, but it becomes difficult to identify the nested tags as the levels deepen. Even though there is a structure to these styles, the CSS remains flat. So there is a divergence between the semantic representation and its meaning. Not to mention, the repitition of the parent descriptors (such as article) violates the DRY principle and reduces refactorability. Thankfully, nesting can help. The above CSS is actually the output (un-minified) of the following LESS source:

{% highlight css linenos %}
article {
    border: 1px dashed black;
    header {
        border-bottom: 1px solid black;
        margin-bottom: 5px;
        h1 {
            font-size: 125%;
            font-weight: bold;
        }
    }
    .body {
        padding-left: 10px;
        p {
            color: darkgray;
        }
    }
    footer {
        text-align: right;
    }
}
{% endhighlight %}

Nesting these descriptors brings the document's semantic representation much closer to the actual structure. It provides clear semantic value by illustrating the structure behind the descriptors for the developer. Though not required, the indentation also helps greatly in this regard. It also means that the parent descriptors (such as article) are only present in the markup once, improving refactorability. The curly braces used to define the nesting also serve as a grouping mechanism to hold these related styles in close proximity. As a bonus, the nesting can also be utilized with media queries, turning this:

{% highlight css linenos %}
@phonewidth: 480px;
.someclass {
    float: right;
    padding-left: 5px;
}
// other styles...
@media (max-width: @phonewidth) {
    .someclass {
        float: none;
        padding-left: 0;
        padding-bottom: 5px;
        text-align: center;
    }
// other styles...
}
{% endhighlight %}

Into this:

{% highlight css linenos %}
@phonewidth: 480px;
@media-phone: ~"(min-width: @{phonewidth})";
.someclass {
    float: right;
    padding-left: 5px;

    @media @media-phone {
        float: none;
        padding-left: 0;
        padding-bottom: 5px;
        text-align: center;
    }
}
// other styles...
{% endhighlight %}

LESS enables you to keep all styles for a single descriptor in one place. An additional benefit is that the descriptor need not be repeated. LESS variables mean you can do this without even repeating your conditions for the media query. I'm sure there are some (many?) who prefer to group the styles together by media type, rather than by descriptor, as is necessary in plain CSS. LESS does not preclude you from writing your styles this way, instead it enables you to write it either way.

As you can see, there are some pretty big benefits to the nesting capabilities of LESS. I find that my stylesheets have become much more manageable thanks to this feature. More LESS to come!
