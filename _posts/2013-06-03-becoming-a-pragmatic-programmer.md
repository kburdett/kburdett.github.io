---
layout: post
title: Becoming a Pragmatic Programmer
date: 2013-06-03 23:27:51.000000000 -04:00
category: growth
tags:
    - Pragmatic Programmer
    - Study
author: Kevin Burdett
---
I recently finished [The Pragmatic Programmer: From Journeyman to Master](http://www.amazon.com/The-Pragmatic-Programmer-Journeyman-ebook/dp/B000SEGEKI/) by Andrew Hunt and David Thomas. I was quite impressed by the book. It isn't so much about the art of programming, so much as the art of being a programmer. To restate, the book describes how to be a better programmer, not how to write better programs. It was a bit of diversion from some of the more technical books I have been reading lately. I was very impressed with the book. It was too much for me to absorb in the first pass. I will have to work on digesting it and come back for another pass. Next year perhaps... I thought that I would share some of the things that I took away from this read.

# Craftsmanship

> One hundred years from now, our engineering may seem as archaic as the techniques used by medieval cathedral builders seem to today's civil engineers, while our craftsmanship will still be honored.

Programming teams are often viewed as factory workers. Reliably churning out line after line of code. However, this is a poor representation of what we do. We are, in fact, individual craftsmen who pour a little bit of ourselves into every line of code. Once you get to know your teammates, you can often tell who has written certain methods and classes simply by the style in which the code is written. Certainly not the mark of an assembly line. The quote above sums it up nicely, I think. Although methodologies and languages will change with time, future programmers should still be able to look back over the code we have written and admire the craftsmanship and care with which it has been constructed. A lofty goal, indeed! We should take pride in our work and strive for the highest level of professionalism and quality in all that we do, and all the code that we write.

# Know Thy Tools

> Tools amplify your talent. The better your tools, and the better you know how to use them, the more productive you can be.

Stop by the workspace of any decent mechanic and you will find a large collection of well organized tools. Most likely, this mechanic has built his collection over many years and with substantial investment. His toolbox will be well organized. Each tool will have both a place and a purpose. It is important that the mechanic know both how and when to utilize each tool. The same can be said of a programmer. A programmer who cannot use Visual Studio is useless on a team developing in .NET, no matter how amazing his grasp on the abstracts of computer science might be. The authors suggest beginning with a small set of general purpose tools. Master both their use and their application. From this base, you can acquire new tools to add to your toolbox as your specific needs change. I would suggest beginning with the IDE most appropriate for your language and the source control utility of your choice. On our team, a mastery of Visual Studio and Git will take you a _long_ way. Small gains in proficiency with your most frequently used tools can improve your productivity and effectiveness by leaps and bounds over time. I have come to consider this is a vital part of professional development that should be taken very seriously.

# DRY

> Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

The DRY (Don't Repeat Yourself) principle seems so simple on the surface, but it becomes clear that this is far deeper as the authors explore the concept. I consider the re-use of code, the sharing of methods and objects, and other good programming practices to avoid duplication of code to be mandatory. However, the authors take this a step further and consider the duplication of _knowledge_. For instance, consider a database schema. Most likely, you may have this concept duplicated multiple times without realizing it. You might have the actual database schema, the code to access it, the SQL to create the schema, and the documentation about the schema. All of these represent the same concept, the structure of the database. To make things worse, they are most likely all stored in different mediums and in different repositories. The authors stress the use of code generators and DSL (Domain Specific Languages) to store the concepts once, and generate the various "views" from this single, authoritative representation. This can be performed fairly easily with a database schema via one of the many great ORM (Object-Relational Mapping) utilities currently available. However, this can be much trickier with other forms of knowledge within a software project.

# Communication

> Having the best ideas, the finest code, or the most pragmatic thinking is ultimately sterile unless you can communicate with other people.

No programmer is an island. We must communicate with our teammates, management, support, sales, customers, etc. I suspect that most programmers, myself included, would much prefer to code, undisturbed, in a dark basement somewhere. However, this is not what breeds quality software. I have been given the privilege to work on a team that places great value in transparency. This is true not just within a team, but externally as well. This level of openness requires a great deal of communication both within and outside the team. In doing so, it is often necessary to communicate with communicate with those who do not speak computer science. The reality is that effective communication is often more valued than coding ability in the business world. Communication is something that we should embrace and value. It is not a necessary evil, but an intrinsic part of what we do. Being a pragmatic programmer means also being a proficient communicator. This is one of the primary motivations for this blog! It helps me hone my communication skills.

# There Are No Final Decisions

> Instead of carving decisions in stone, think of them more as being written in sand at the beach. A big wave can come along and wip them out at any time.

The authors approached this concept encouraging the construction of flexible architectures. Making your code flexible enough to withstand major changes in requirements. For instance, changing database requirements and moving from MSSQL to Oracle. However, I actually viewed this from a slightly different angle. I don't think it was the author's intention, but I was reminded more of _over_ engineering. I think it is just as dangerous, and a temptation to which we programmers often succumb. On Agile teams, the requirements and needs can change very rapidly. It is important remain open to this, even embrace it, rather than boxing yourself into a framework and risk throwing away days of work instead of a couple of hours.

There are many other valuable topics within the book. These are the topics that stood out to me the most. I enthusiastically recommend the book. I hope you find it as valuable as I have!
