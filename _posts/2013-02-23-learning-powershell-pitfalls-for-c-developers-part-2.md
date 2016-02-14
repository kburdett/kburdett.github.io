---
layout: post
title: Learning PowerShell, Pitfalls for C# developers - Part 2
date: 2013-02-23 18:11:33.000000000 -05:00
category: coding
tags:
    - PowerShell
    - Scripting
author: Kevin Burdett
---
Continuing my post on learning PowerShell, I want to talk a bit about using parenthesis in PowerShell. They can be a bit confusing in PowerShell and generate some unexpected results for those coming from C#. There are two basic usages in PowerShell: grouping, and method calls. Grouping is just basic order of operations, so I don't really see the value in discussing it further. However, method calls in PowerShell are definitely worth discussing

# PowerShell Functions and Cmd-lets

Consider the following source code.

{% highlight powershell linenos %}
function Get-Something ($foo, $bar)
{
    "1: $foo"
    "2: $bar"
}
{% endhighlight %}

For a C# developer, this might seem a bit odd though. The function declaration looks just like a C# declaration, minus the types. So it might make sense to call it just like a C# function, like so:

{% highlight powershell linenos %}
function Get-Something ($foo, $bar)
{
    "1: $foo"
    "2: $bar"
}

Get-Something ('first', 'second')
{% endhighlight %}

Seems logical enough, except the part where this doesn't work... Naturally, we would expect this for an output:

    1: first
    2: second

Instead, we get this:

    1: first second
    2:

Definitely counter-intuitive, but easily understood with a little consideration. The parenthesis aren't defining the function arguments as you might expect in a language like C#, instead it is actually adding order of operations. PowerShell is evaluating the contents of the parenthesis and passing the results as an argument to the Get-Something function. Since we used a comma to separate our arguments, PowerShell conveniently turned it into an array for us and passed the resulting array as the first argument of the function. "Convenient," but not even close to what we wanted. Coincidentally, if we remove the comma we get something different entirely.

{% highlight powershell linenos %}
function Get-Something ($foo, $bar)
{
    "1: $foo"
    "2: $bar"
}

Get-Something ('first' 'second')
{% endhighlight %}

This time we get an error.

    Unexpected token 'second' in expression or statement.
    At line:1 char:32
        + Get-Something ('first' 'second' <<<< )
        + CategoryInfo          : ParserError: (second:String) [], ParentContainsErrorRecordException
        + FullyQualifiedErrorId : UnexpectedToken

PowerShell is still evaluating the contents of the parenthesis before calling the function, but by removing the comma, it just doesn't know what to do with them. This brings us to the proper way to call a PowerShell function or Cmd-Let, without the parenthesis!

{% highlight powershell linenos %}
function Get-Something ($foo, $bar)
{
    return "$foo $bar"
}

Get-Something 'first' 'second'
{% endhighlight %}

And this gives us our expected output. Simple enough right? But wait, it doesn't stop there...

# .NET Functions

One of PowerShell's greatest selling features is the ability to use .NET natively. However, somebody decided that the parenthesis rules should be different for .NET objects. Whenever you call a method of an object, the parenthesis rules look much more like those in C#. Consider the following script.

{% highlight powershell linenos %}
Get-Date | Get-Member
{% endhighlight %}

This outputs all of the members (methods and properties) present on the return value of the Get-Date function. The output looks like this:

	TypeName: System.DateTime

    Name                 MemberType     Definition
    ----                 ----------     ----------
    Add                  Method         System.DateTime Add(System.TimeSpan value)
    AddDays              Method         System.DateTime AddDays(double value)
    AddHours             Method         System.DateTime AddHours(double value)
    AddMilliseconds      Method         System.DateTime AddMilliseconds(double value)
    AddMinutes           Method         System.DateTime AddMinutes(double value)
    ...

.NET developers will undoubtedly be familiar with the System.DateTIme object and it's many methods. So let's say that we want to call one of these methods. For instance, we want to call the ToString function to output our current date and time in a specific format. Easy enough:

{% highlight powershell linenos %}
$today = Get-Date
$today.ToString('g')
{% endhighlight %}

Naturally, this produces the simple output of the current date and time:

    2/23/2013 5:51 PM

So this is pretty much what a .NET developer would expect from a method call against a .NET object.

As a programmer, I found the dual usage of parenthesis a bit off-putting at first, but I suppose these kind of oddities are to be expected when mixing language paradigms though. After all, .NET is object oriented, while PowerShell is purely procedural. Weird, but it works!
