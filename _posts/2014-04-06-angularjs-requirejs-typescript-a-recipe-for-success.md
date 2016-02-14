---
layout: post
title: 'AngularJS + RequireJS + TypeScript: A Recipe for Success?'
date: 2014-04-06 20:01:47.000000000 -04:00
category: coding
tags:
    - Angular
    - JavaScript
    - Require
    - TypeScript
author: Kevin Burdett
---
I've been hearing a lot about [Angular](http://angularjs.org/) recently. I decided to give it a try and see what all the fuss is about. My homepage was in need of redesign anyways... Up until now, my homepage has been largely JavaScript free. Since I would be adding a body of JavaScript code, it also seemed like the perfect time to pull in two other technologies that I'm a fan of... [TypeScript](http://www.typescriptlang.org) and [Require](http://requirejs.org). This post is mostly about Angular, but you will see TypeScript and Require sprinkled throughout as well.

There is _a lot_ of information I want to cover in this post, and I am only scratching the surface of what Angular can do. Unfortunately that means I will have to gloss over a great many details. I will try to focus on the technical implementation, and less on the journey of getting to it. I will follow up with my overall impressions at the end of the post. If you aren't familiar with [Angular](http://angularjs.org/), [TypeScript](http://www.typescriptlang.org), or [Require](http://requirejs.org), you should go do some reading on the technologies involved first. To cut down on the snippet sizes, I will often edit or crop files in this post. However, you can get the full version from [my Git repository](https://github.com/kburdett/kburdett.github.io).

# What is Angular?

[Angular](http://angularjs.org/) is a highly extensible, client-side MVC framework built in JavaScript. It has a great feature-set, including configurable routing, templating, extensibility via dependency injection, and a powerful two-way data binding framework. It is a lightweight framework that uses standard JavaScript and HTML. You get a full scale MVC framework for less than one hundred kilobytes of JavaScript. No special hosting requirements needed. Pretty slick! There is a lot of information at the [Angular homepage](http://angularjs.org/). I will only scratch the surface of its feature set here, so I encourage you to go check it out yourself.

# Building an Angular Website

Time to get into the technical stuff! I started off with following the [Angular tutorial](http://docs.angularjs.org/tutorial) and making the changes I saw in my own site. I also used the [Angular seed project](https://github.com/angular/angular-seed) to establish the project structure and naming convention. I ended up with a structure basically identical to the seed project.

* css
    * style.less - the sole style sheet for my site
* img
    * contains static images
* js
    * dist
        * contains the third-party distribution files (well, the one's not loaded through CDN...)
    * app.ts - application module definition and route configuration
    * controllers.ts - controller module definition and controller code
    * main.ts - Require configuration and Angular bootstrapping
    * services.ts - service module definition and service code
* partials
    * contains all partial views
* typings
    * [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped) repository
* index.html - the application template

# The Application Template

Every site needs an index.html, or some equivalent. An Angular site is no different, so it seems like a good place to start. However, the index.html file in Angular is more than just a start page. It is the application template. It provides both structure and initialization to your application. Those familiar with ASP.NET MVC can think of it as _Layout.cshtml (or Site.master) and Global.asax rolled into one. You can create multiple applications in an Angular site, but you can only load one per template. Unlike _Layout.cshtml in an ASP.NET MVC project, your index.html will be retrieved, verbatim, by the web client. Once downloaded, Angular will bootstrap itself via JavaScript and start your application. After initialization, Angular will reload portions of your page as needed, without going through the entire bootstrap setup again. I've stripped my index.html down to the relevant bits for this section.

### index.html

{% highlight html linenos %}
<!DOCTYPE html>
<html lang="en">
<head>
    <!--- ... -->

    <script src="/url/to/require.min.js" data-main="js/main.js"></script>

    <!--- ... -->

    <style type="text/css">
        [ng-cloak] {
            display: none;
        }
    </style>
</head>

<body>

<!--- ... -->

<div class="container">

    <!--- ... -->

    <div id="placeholder" ng-cloak ng-view></div>

</div>

<!--- ... -->

</body>
</html>
{% endhighlight %}

There are three things I will call your attention to.

1.  There is no `ng-app` attribute on the `html` element. Normally, this attribute tells Angular which application this page is bound to. Its removal is one of the things necessary to support Require. Since our JavaScript is loaded asynchronously, we will bootstrap the application manually, once we have assured that all the requisite pieces have been loaded.
2.  There are no Angular script tags. Since we are using Require, we don't need them! You will notice that we are loading "js/main.js" via the Require `data-main` attribute. This file will be responsible for all setup work. We will look at this file next.
3.  There are two Angular directives attached to the "placeholder" div (the ID was added only for ease of reference).
    * ng-view: tells Angular to replace the contents of this div with the current view. We will talk more about views later.
    * ng-cloak: corresponds with the style element in the header and tells Angular to hide this div while a request is being processed in order to avoid the rendering of partial content

## Bootstrapping

Now that we have our application template set up, we need to start up an Angular application to get some content. In the previous section, I pointed out the `data-main` attribute on the Require script tag. The `data-main` attribute specifies a startup script for Require. This script is loaded asynchronously, as soon as Require is run. Its job is to first configure Require, then launch our application. A side effect of the `data-main` attribute is that Require will use the parent folder of the specified JavaScript file as the base directory. You can override this behavior by setting the base directory manual, but this is actually the behavior I want since main.ts lives along side most of my other scripts. Now, let's take a look!

### main.ts

{% highlight javascript linenos %}
///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

require.config({
    paths: {
        'jquery': '/url/to/jquery-2.1.0.min',
        'angular': '/url/to/angular.min',
        'angular-route': '/url/to/angular-route.min',
        'angular-sanitize': '/url/to/angular-sanitize.min',
        'angular-resource': '//url/to/angular-resource.min',
        'angulartics': 'dist/angulartics.min',
        'angulartics-ga': 'dist/angulartics-ga.min',
        'bootstrap': '/url/to/bootstrap.min'
    },

    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery', 'dist/domReady!']
        },
        'angular-route': ['angular'],
        'angular-resource': ['angular'],
        'angular-sanitize': ['angular'],
        'angulartics': ['angular'],
        'angulartics-ga': ['angular', 'angulartics'],
        'bootstrap': ['jquery']
    }
});

// startup the application
require(['angular', 'dist/domReady!', 'app'],
    function (angular:ng.IAngularStatic, document) {
        // bootstrap the document, since we are loading asynchronously
        angular.bootstrap(document, ['homepage.app']);
    }
);
{% endhighlight %}

So what is going on here?

First, we have to configure Require. We do so by calling `require.Config()`. Since we are using the `data-main` attribute, we don't need to configure the base path. For consistency, ease, and <abbr title="Content Delivery Network">CDN</abbr> compatibility, I have configured paths for all of the third party libraries we will need under `paths`. Nothing terribly interesting there. I have also configured shims for the legacy (non-<abbr title="Asynchronous Module Definition">AMD</abbr>) JavaScript components to help manage dependencies. This isn't really a big deal in an application of this size, but it is a life-saver in larger ones. Also, Angular has global namespace modifications we want captured, so I have configured the `exports` property as well.

Now that Require is configured, we can start up our application. We make a call to the `require()` function, specifying our dependencies.

* angular - Angular module.
* dist/domReady - small plugin that ensures our function will not execute until the browser indicates the <abbr title="Document Object Model">DOM</abbr> is ready to accept modifications. This is important, as Angular will be making many <abbr title="Document Object Model">DOM</abbr> modifications.
* app - our own module containing the Angular application definition.
Once these are loaded, we can bootstrap our Angular application using `angular.bootstrap()`. Here we tell it to load our application module `homepage.app` which is defined in app.ts. It is possible to do this using the `ng-app` directive on the root `html` element in index.html as well, but doing it this way enables Require to load all of our dependencies first.

## Angular Application

So now Require has loaded all of our files, and our application module has been loaded. The magic of Angular begins. But what is it actually doing? To answer that, we need to take a look at our application module.

### app.ts

{% highlight javascript linenos %}
///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-route.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

/* ... */

define(['angular', 'angular-route', 'controllers' /* ... */],
    function (angular:ng.IAngularStatic) {

    angular
        .module('homepage.app', [
            'homepage.controllers',
            'ngRoute',

            /* ... */
        ])

        .config(['$routeProvider',
            function ($routeProvider:ng.route.IRouteProvider) {
                $routeProvider
                .when('/', { redirectTo: '/about_me' })
                .when('/about_me', { templateUrl: 'partials/about_me.html' /* ... */ })
                .when('/about_page', { templateUrl: 'partials/about_page.html' /* ... */ })
                .when('/aiken', { templateUrl: 'partials/aiken.html' /* ... */ })
                .when('/blog', { templateUrl: 'partials/blog.html' /* ... */ , controller: 'BlogCtrl' })
                .when('/coding', { templateUrl: 'partials/coding.html' /* ... */ })
                .when('/connect', { templateUrl: 'partials/connect.html' /* ... */ })
                .when('/error', {templateUrl: 'partials/error.html' /* ... */ })
                .otherwise({templateUrl: 'partials/404.html' /* ... */ });
            }])

        /* ... */
        ;
    }
);
{% endhighlight %}

Here we create our first Angular module. This module represents the top level module. It is responsible for coordinating and wiring communication between the other modules. As you can see, we create this module by calling `angular.module()`. This function creates and returns a new module. It takes two parameters here, the first is the name of the module being created. This name is the same as referenced in the `angular.bootstrap()` call from main.ts. The second argument is a list of dependencies. These dependencies are Angular modules, not script files. This will help Angular get a "lay of the land" for our project. Here, I am passing "homepage.controllers" and "ngRoute". This will give me access to all of my controllers and `$routeProvider`, respectively. After defining my module, I can configure it with a call to `.config()` by passing in a configuration function. This configuration function uses the annotated function syntax defined by Angular. It interacts with the dependency injection system. I am passing in an array, where the last item in the array is a function and all prior items are the arguments (in order) that should be injected into that function. In this example, I pass the string "$routeProvider" to indicate that Angular should inject a route provider for me (you can read more about providers in the [provider <abbr title="Advanced Programming Interface">API</abbr> documentation](http://docs.angularjs.org/api/ng/provider)). I then use this provider to configure my routes using JavaScript promises (Angular uses a syntax based on [Q](https://github.com/kriskowal/q)). I think the syntax is pretty straightforward, you can redirect, load a partial template, specify a controller and a few other less useful things (see the [route provider documentation](http://docs.angularjs.org/api/ngRoute/provider/$routeProvider)). As you can see, most of my routes simply load static templates, but controllers are where things get interesting!

## Controllers

Controllers are what makes Angular truly dynamic. You don't actually need to define routes, or even an application to use controllers. Angular provides directives to reference a controller directly from the page, but I won't really get into that here. I assume that any page of decent size is going to need routes, applications, etc. Unlike ASP.NET MVC, controllers in Angular are merely functions. Lightweight and to the point. Let's take a look at how I have defined my blog controller.

### controllers.js

{% highlight javascript linenos %}
///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-resource.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />
///<reference path='./services.ts' />

interface IBlogPostScope extends ng.IScope {
    wordPressPosts: WordPressPostsModel;
}

define(['angular', 'angular-sanitize', 'services'],
    function (angular:ng.IAngularStatic) {

        var blogCtrl = ['$scope', 'WordPressPosts',
        function ($scope:IBlogPostScope, WordPressPosts:ng.resource.IResourceClass<WordPressPostsModel>) {
            WordPressPosts.get({site: 'kaburdett.wordpress.com'},
            function (data:WordPressPostsModel) {
                $scope.wordPressPosts = data;
            })
        }];

        angular
            .module('homepage.controllers', ['ngSanitize', 'homepage.services'])
            .controller('BlogCtrl', blogCtrl);

    }
);
{% endhighlight %}

Controllers use the same annotated function format that we saw for the configuration function earlier. Here you can see that I am creating a new module, named "homepage.controllers", and creating a single controller name "BlogCtrl" using the `.controller()` method. I have asked Angular to inject `$scope` and `WordPressPosts` into my controller function. The `$scope` object is this controller's connection to the view similar to the `ViewBag` concept in ASP.NET MVC. Anything assigned to that object will be available for consumption by the view. The `WordPressPosts` object being injected is a custom service that I have written to retrieve blog posts from WordPress.com's public <abbr title="Advanced Programming Interface">API</abbr>. Allow me to ignore this for now... The code reads well enough to see that `$scope.wordPressPosts = data` is assigning a collection of my WordPress.com posts to a property on the scope. Once on the scope, the data is ready for consumption in a template.

## Partial Templates

This brings us to the meat of what Angular does. It turns templates into views. We've already looked at the blog post controller, now let's take a look at the view.

### blog.html

{% highlight html linenos %}
{% raw %}
<!-- ... -->
<div>
    <div class="blog-article" ng-repeat="post in wordPressPosts.posts">
        <h4>
            <span ng-bind-html="post.title"></span>
            <small>{{post.date | date: 'MM/dd/yyyy HH:mm'}}</small>
        </h4>
        <p ng-bind-html="post.excerpt"></p>
    </div>
</div>
{% endraw %}
{% endhighlight %}

Thus the magic begins. I'm using a combination of directives and placeholders to pull content out of my model. Obviously, the `wordPressPosts` property matches with the one my controller assigned. Angular has some really powerful functionality here. Alas, this blog post is already huge, so I am going to skip over it for now. If you are familiar with web template frameworks, then nothing I have done in this template will be interesting. Look for a follow up after I have had an opportunity to play with some of the more advanced features of Angular.

## Services

I skipped over this part while we were discussing the controller, but services are incredibly powerful. Angular provides an injectable data service framework that you can use to manage data access from controllers. You can wrap database operations, <abbr title="Representational State Transfer">REST</abbr> calls, file-system operations, or just about anything that you can think of. For my project, I wrote a small service that provides an interface into WordPress.com's JSONP Public <abbr title="Advanced Programming Interface">API</abbr>. Once again, I am barely scratching the surface here. Let's take a look at the service.

### services.ts

{% highlight javascript linenos %}
///<reference path='../typings/angularjs/angular.d.ts' />
///<reference path='../typings/angularjs/angular-resource.d.ts' />
///<reference path='../typings/requirejs/require.d.ts' />

interface WordPressPostsModel {
    found: number;
    posts: WordPressPostModel[];
}

interface WordPressPostModel {
    ID: number;
    title: string;
    URL: string;
    excerpt: string;
}

define(['angular', 'angular-resource'],
    function (angular:ng.IAngularStatic) {

        var WordPressPosts = ['$resource',
            function ($resource:ng.resource.IResourceService) {
                return $resource('https://public-api.wordpress.com/rest/v1/sites/:site/posts',
                    { callback: 'JSON_CALLBACK', number: 5, order_by: 'date' },
                    { get: { method: 'JSONP', params: {site: 'site'} }});
            }
        ];

        angular
            .module('homepage.services', ['ngResource'])
            .factory('WordPressPosts', WordPressPosts)
    }
);
{% endhighlight %}

I start by defining two interfaces (one is a list of the other). These interfaces are stand-in models that represent a typed subset of WordPress.com's response. I don't use much, so I only declare the properties I am interested in. To register the service, first I create a new module, which depends on "ngResource". This is a plugin to make RESTful queries a bit easier to work with. Once the module is created, I register a factory method named "WordPressPosts". This factory method configures and returns a new resource service using the injected constructor provided by ngResource. I am only defining a get method here, but services that allow modifications are absolutely possible. As you can see, there isn't much code required to make this operational. Once defined, I need only inject this into a controller and call `get` as we saw in `BlogCtrl`.

## Behold! A Working Site

That's a high-level overview, top-to-bottom, of how an Angular project is constructed using Require and TypeScript...

# Initial Assessment

Now that I have a working site, what do I think of Angular, you ask? Excellent question! I feel like I've built a children's slide out of titanium and carbon fiber. Sure it works, but overkill is an understatement. My homepage hardly represents a fitting proving ground for a framework of this scale. Still, my impression is very positive. Angular is fast, lightweight, and very powerful. I love that you can turn a static page into a full MVC application without any special hosting requirements. It was built with testing in mind and integrates well with [Karma](http://karma-runner.github.io/0.12/index.html). I think testability is mandatory for the adoption of any framework on virtually any scale. The documentation is a little rough in places, but the community is active, the project is still growing and improving, and new sites are adopting it all the time. All good signs. I'm looking forward to working with it more.

I did run into a few struggles along the way. I thought a few were worth noting.

## Crawlers and SEO

Since Angular is entirely JavaScript based, any clients not running JavaScript will obviously not be able to access your content. This isn't really an issue with today's browser landscape, save one thing. Search engines! Search engines use bots to peruse the web and index content. These bots do not run JavaScript. Thus, your site cannot be properly indexed out of the box. There are solutions to this. However, they involve modifications to the hosting server to enable server-side pre-rendering. This rendering can be done in real-time on the server or cached by a service, such as [Prerender.io](https://prerender.io/). While not difficult, this may present an issue to some hosting locations (like [GitHub pages](http://pages.github.io)... doh!). This problem is not exclusive to Angular either. All client-side rendering frameworks, such as [Backbone](http://backbonejs.org/) and [Ember](http://emberjs.com/), suffer from the same issue.

## Google Analytics

In its default configuration, Google Analytics relies on page loads to track page views. Single-page applications, such as those built with Angular, would only register a single hit. This would mask a great deal of traffic. Thankfully, the open-source community has come to the rescue with [Angulartics](https://github.com/luisfarzati/angulartics). I have already incorporated this into my site here. I trimmed it from the excerpts that I have put up so far, but the instructions on the site are very easy to follow. Also, you can see the changes in [app.ts on my GitHub repository](https://github.com/kburdett/kburdett.github.io/blob/master/js/app.ts).

## Scaling Up

Angular is still a new technology. I do wonder how well it scales in performance and maintainability in the enterprise scale. Without actually building an enterprise scale app, I think the best way to assess this is to talk to those who have. That raises the first question... Is anybody out there using it in a large scale application? Angular has [a portfolio on their page](http://builtwith.angularjs.org/), with many examples. Browsing the catalog, I found lots of hobbyist and open-source projects, but not a lot of names I recognized. I'm a big fan of open-source, but I'm looking for volume in this case. I found a few projects that were encouraging, but it is tough to gauge size and volume.

* [Google DoubleClick](http://www.google.com/doubleclick/): Angular is Google's _framework_ and advertising is Google's _business_. DoubleClick is their premium ad product, so this represents a _big_ investment from a _big_ company.
* [VEVO](http://www.vevo.com/)
* [YouTube for TVs](https://www.youtube.com/tv#/browse)
* [Plunker](http://plnkr.co/)
* [MINI UK - Design your MINI](http://www.mini.co.uk/design-your-mini)

Apart from sites, I found some great blog posts on scaling with Angular too.
* Localytics moved from Backbone to Angular and documented their findings [on their company blog](http://www.localytics.com/blog/2013/angularjs-at-localytics/).
* Jason Dobry has an [excellent blog post](https://coderwall.com/p/y0zkiw) on the subject. It is accompanied by an [excellent presentation](http://slid.es/jdobry/building-large-apps-with-angularjs) as well. Being new too Angular, most of it is over my head. However, he does discuss a few of my concerns...
* Joel Hooks has a [short, but sweeet blog post](http://joelhooks.com/blog/2013/05/22/lessons-learned-kicking-off-an-angularjs-project/) on lessons learned.
* Per Ploug has a post on [adding ASP.NET MVC-esque conventions to Angular](http://scriptogr.am/pploug/post/convention-based-routing-in-angularjs).

The Localytics article is pretty interesting. It tells a great story for maintainability. Still, I don't really consider 3,500 lines of code to be enterprise scale.

# Uncharted Territory

Angular has a very rich feature set. I'm just scratching the surface so far. There is plenty left to explore. I hope to tackle some of these in the coming days, so keep an eye out for more posts. Here are the things that caught my interest.

*   **Testing**: Angular was built from the ground up with testability in mind. All of that dependency injection was introduced so that mocked components could be swapped out. This is pretty awesome, and I really want to learn more about it.
*   **Directive**: I love unobtrusive JavaScript, but having tons of little blobs of JavaScript that do nothing more than wire-up elements (usually by ID or class) at the bottom of a page can be difficult (and frustrating!) to manage. It seems to me that directives could solve that problem for good, but I don't have a great understanding of what their capabilities are yet.
*   **Bi-directional binding**: This is actually one of Angular's biggest selling points. Unfortunately, I don't have any content to really stretch Angular's binding capabilities. I'll have to find something...
*   **Testing... again**: It is worth looking at twice!

Look for more posts to come as I explore!
