---
layout: post
title: 'GitHub: Let the awesome begin'
date: 2014-03-24 00:26:35.000000000 -04:00
category: technology
tags:
    - Git
    - GitHub
    - Hosting
author: Kevin Burdett
---
After a long hiatus, I decided to start investing in my online profile again. I added some content on my homepage, re-themed my blog, and launched another push to blog more (hence this post). It seemed like a good opportunity to re-evaluate my technology stack as well. I have been hosting my homepage and my Git repositories on my Synology NAS here at the apartment, while my blog is hosted here at WordPress.com. This arrangement has been working well enough, but I'm not too keen on hosting my stuff here. The homepage hasn't been much trouble, but hosting my Git server has been a bit of a pain. Thus began my quest to host elsewhere.

## The journey begins...

I started with GitHub... and ended with GitHub. It was the world's shortest journey. Seriously, the decision took about 30 seconds. "Why GitHub," you ask? I have multiple reasons.

*   It is free.
*   I already had an account (2 of them, in fact...)
*   They are the Git experts
*   Their tools are pretty awesome (although, I prefer command line Git)

The first repository I wanted to migrate was my configuration files (.bashrc, .vimrc, etc) repository. At first, I thought this seemed like an abuse of a free GitHub account. It is intended for open source software, after all, not my personal configuration stuff. Besides, why would anyone else care? I poked around a little bit to see if anyone else was doing this. It turns out others are doing this. Thousands of others. If fact, GitHub _wants_ your configuration. They even created [a page to help you get started](http://dotfiles.github.io/). I was happy to oblige and started about moving my repository. Thankfully, moving a Git repository from one host to another is stupid easy. You just create the repository on the destination, update your origin, and push. Just two lines in your favorite shell.

```shell
git remote --set-url origin https://github.com/{username}/{repository}.git
git push
```

To make it even better, you don't even have to give up your commit history. Yay Git! If you are curious, you can check out [my dotfiles over at GitHub](https://github.com/kburdett/dotfiles).

## The great website move of 2014

With my dotfiles out of the way, I moved on to my next repository. This one holds the source code for [my super un-complicated homepage](http://www.kevinburdett.com). Once again, I wasn't sure if this would be an abuse. Releasing my homepage's source code isn't exactly a gift to the world. As before, I poked around a bit to see if others were doing the same thing. I was pleasantly surprised, once again. Not only is it acceptable, but GitHub _wants_ your homepage. GitHub created [GitHub pages](http://pages.github.com/) for precisely this purpose. They are happy to host sites for users, organizations, and projects alike. All for free! Even with custom domain support! How awesome is that?

Despite being free, I still had to consider whether to make the switch. I found a few compelling reasons to switch.

1.  It doesn't use my bandwidth. My site doesn't get much traffic, but it's still something to consider.
2.  I don't have to worry about reliability. Bringing down my NAS for an upgrade would no longer kill my website.
3.  I don't have to deal with residential ISP uptime agreements. Hint: they aren't good...
4.  It comes with an automatic deployment mechanism. All I have to do is push my repository. It doesn't get any easier.

It was a pretty easy decision to make. Once decided, I just had to migrate the site. Create the repository, push my code, add a CNAME record on my domain host, wait 10 minutes and the "great" website move was done. Not so dramatic after all...

There you have it, two more reasons why GitHub is awesome :)
