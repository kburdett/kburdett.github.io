---
layout: post
title: PowerShell - The Command Quoting Conundrum
date: 2013-05-21 22:07:49.000000000 -04:00
category: coding
tags:
    - MS Deploy
    - PowerShell
    - Scripting
author: Kevin Burdett
---

I have discovered one of the most infuriating problems with PowerShell. It is nearly impossible to work with complex command line applications. Microsoft refers to these as "legacy" applications. By this definition, every application that is not a PowerShell Cmdlet is "legacy", which is rather absurd... The problem is that PowerShell insists on re-parsing all of your arguments and applying its own quoting rules. I find this behavior very helpful in the general case. However, there is no way to bypass this behavior. When you meet an application with slightly more obstinate (or perhaps obtuse is a better word...) argument parsing rules, this become an impossibly frustrating behavior.

Enter MS Deploy, Microsoft's web deployment application. MS Deploy is all kinds of awesome. If you are using anything else to deploy a website to IIS, I would argue that you are doing it wrong! I recently converted all of our work deployments over to using MS Deploy. I chose PowerShell as the medium for the deployment scripts. It is the de facto choice when scripting in the Windows sphere. Unfortunately, this turned out to be a recipe for massive frustration. MS Deploy, it turns out, is _very_ picky about how you formulate its command line arguments. After constructing the command line, I was greeted with this error message:

    msdeploy.exe : Error: Unrecognized argument '"-source:"'.
    All arguments must begin with "-".

In short, wrapping the entire argument in quotes causes a parse error within MS Deploy. Normally, these quotes would parse out and the command line would be correctly interpreted, but not with MS Deploy. "No problem," I thought, "let me just reform the arguments a bit to address this..."

Thus the slow, agonizing descent to insanity began... The journey took about 2 days, I will distill the results for you here using a little C# application that I wrote to print out the entire command line, as seen by the target executable, followed by each of the arguments, as tokenized by the .NET command line interpreter. I realize there is a similar program already available (EchoArgs) to assist with this kind of debugging. I wanted to see the entire command line, not just the tokenized version, since MS Deploy is not tokenizing in the standard way. To set this up, I started with a little set-up work in PowerShell.

{% highlight powershell %}
$printArgs = Join-Path $pwd "..\PrintArgs.exe"
$package = "C:\Some\Path\With Spaces.zip"
$destination = "SomeComputer"
$parameterFile = "C:\Some\Path\To an xml file.xml"
{% endhighlight %}

Once the basic setup was in place, I began to try some different quoting options.

# Attempt 1

First, I try the command line without any quotes at all. Basically, throw caution to the wind and hope for the best.

{% highlight powershell %}
& $printArgs -source:package=$package -dest:auto,computerName=$destination,includeAcls=False -verb:sync -setParamFile:$parameterFile
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\PrintArgs.exe"  "-source:"package=C:\Some\Path\With Spaces.zip"" "-dest:auto computerName=SomeComputer includeAcls=False" -verb:sync "-setParamFile:"C:\Some\Path\To an xml file.xml""
    Parsed Arguments:
        -source:package=C:\Some\Path\With
        Spaces.zip
        -dest:auto computerName=SomeComputer includeAcls=False
        -verb:sync
        -setParamFile:C:\Some\Path\To
        an
        xml
        file.xml

Clearly, this is wrong. Just how wrong is somewhat surprising though. Both the actual command line and the parsed arguments are incorrect. PowerShell "conveniently" added quotes for me, but they are not even close to correct.

# Attempt 2

Next I try quoting the individual arguments.

{% highlight powershell %}
& $printArgs "-source:package=$package" "-dest:auto,computerName=$destination,includeAcls=False" "-verb:sync" "-setParamFile:$parameterFile"
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\PrintArgs.exe"  "-source:package=C:\Some\Path\With Spaces.zip" -dest:auto,computerName=SomeComputer,includeAcls=False -verb:sync "-setParamFile:C:\Some\Path\To an xml file.xml"
    Parsed Arguments:
        -source:package=C:\Some\Path\With Spaces.zip
        -dest:auto,computerName=SomeComputer,includeAcls=False
        -verb:sync
        -setParamFile:C:\Some\Path\To an xml file.xml

Better, my tokenized arguments are correct. However, the quotes in front of the -source and -setParamFile arguments still trip up MS Deploy's command line parser and produce the original error message.

# Attempt 3

Next I try applying inner quotes around the paths. My thinking here is that perhaps if I place the quotes in the correct place, PowerShell will not quote the entire argument.

{% highlight powershell %}
& $printArgs "-source:package=""$package""" "-dest:auto,computerName=""$destination"",includeAcls=False" "-verb:sync" "-setParamFile:""$parameterFile"""
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\PrintArgs.exe"  "-source:package="C:\Some\Path\With Spaces.zip"" -dest:auto,computerName="SomeComputer",includeAcls=False -verb:sync "-setParamFile:"C:\Some\Path\To an xml file.xml""
    Parsed Arguments:
        -source:package=C:\Some\Path\With
        Spaces.zip
        -dest:auto,computerName=SomeComputer,includeAcls=False
        -verb:sync
        -setParamFile:C:\Some\Path\To
        an
        xml
        file.xml

Wishful thinking... It added the quotes anyways. I was actually surprised at how poorly it constructed this command line. I am back to square one.

# Attempt 4

At this point, I begin perusing the internet for others in my position. I am definitely not alone, as it turns out. I find many "solutions" put forth by the community since Microsoft has been silent on the issue. The first one I run across is to use single quotes as the nested quote character.

{% highlight powershell %}
& $printArgs "-source:package='$package'" "-dest:auto,computerName='$destination',includeAcls=False" "-verb:sync" "-setParamFile:'$parameterFile'"
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\PrintArgs.exe"  "-source:package='C:\Some\Path\With Spaces.zip'" -dest:auto,computerName='SomeComputer',includeAcls=False -verb:sync "-setParamFile:'C:\Some\Path\To an xml file.xml'"
    Parsed Arguments:
        -source:package='C:\Some\Path\With Spaces.zip'
        -dest:auto,computerName='SomeComputer',includeAcls=False
        -verb:sync
        -setParamFile:'C:\Some\Path\To an xml file.xml'

The arguments parse correctly with this command line, but the change in quotation marks is not sufficient to prevent PowerShell from adding the crippling outer quotes.

# Attempt 5

The next potential "solution" I run across is to use the Invoke-Expression command with the exact string I wish to execute.

{% highlight powershell %}
Invoke-Expression "& $printArgs -source:package=""$package"" -dest:auto,computerName=""$destination"",includeAcls=False -verb:sync -setParamFile:""$parameterFile"""
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\PrintArgs.exe"  "-source:"package=C:\Some\Path\With Spaces.zip"" "-dest:auto computerName=SomeComputer includeAcls=False" -verb:sync "-setParamFile:"C:\Some\Path\To an xml file.xml""
    Parsed Arguments:
        -source:package=C:\Some\Path\With
        Spaces.zip
        -dest:auto computerName=SomeComputer includeAcls=False
        -verb:sync
        -setParamFile:C:\Some\Path\To
        an
        xml
        file.xml

Not suprisingly, back to square one...

![Powershell, Y U NO WORK]({{ site.baseurl }}/assets/powershell_y_u_no.jpg?)

After wasting entirely too much time on this problem, I gave up on finding a proper solution and waded into the plethora of suggested hacks. Ultimately, I came up with 2 that I could stomach (barely).

# Hack 1

The first hack is using the Start-Process command to execute the application.

{% highlight powershell %}
$processArgs = @("-source:package=""$package""", "-dest:auto,computerName=""$destination"",includeAcls=False", "-verb:sync", "-setParamFile:""$parameterFile""")
Start-Process $printArgs -ArgumentList $processArgs -NoNewWindow -Wait
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\PrintArgs.exe" -source:package="C:\Some\Path\With Spaces.zip" -dest:auto,computerName="SomeComputer",includeAcls=False -verb:sync -setParamFile:"C:\Some\Path\To an xml file.xml"
    Parsed Arguments:
        -source:package=C:\Some\Path\With Spaces.zip
        -dest:auto,computerName=SomeComputer,includeAcls=False
        -verb:sync
        -setParamFile:C:\Some\Path\To an xml file.xml

This produced the correct command line and correctly parsed the arguments. Unfortunately, it also funnels the output directly to the console, where it cannot be captured through conventional means. You can get around this using the RedirectStandardOut property. You can redirect the output to a file, read the contents of that file, and print them out to the standard output stream. While this hack looks clean, it requires some pretty ugly supporting work to fit back into the proper PowerShell environment. Alternatively, I could dump the Start-Process call altogether and configure the process manually using the underlying .NET class and read the standard out stream myself. I figure at that point, I might as well write it in C#...

# Hack 2

The second hack is the one I ultimately ended up using. It is pretty simple:

1. Create the command string
1. Write it to a .CMD file in a temporary location
1. Execute the .CMD file
1. Clean up

{% highlight powershell %}
$tempCmd = Join-Path $env:TEMP "temp.cmd"
New-Item $tempCmd -Force -Type file > $null
$commandLine = """$printArgs"" -source:package=""$package"" -dest:auto,computerName=""$destination"",includeAcls=False -verb:sync -setParamFile:""$parameterFile"""
Set-Content $tempCmd $commandLine
& $tempCmd
Remove-Item $tempCmd
{% endhighlight %}

Which produces the following output.

    "C:\users\kevin\cloudstation\blog\..\PrintArgs.exe"  -source:package="C:\Some\Path\With Spaces.zip" -dest:auto,computerName="SomeComputer",includeAcls=False -verb:sync -setParamFile:"C:\Some\Path\To an xml file.xml"
    Parsed Arguments:
        -source:package=C:\Some\Path\With Spaces.zip
        -dest:auto,computerName=SomeComputer,includeAcls=False
        -verb:sync
        -setParamFile:C:\Some\Path\To an xml file.xml

Other than some weirdness with the relative path in my example, this is the exact output I was looking for. I could use Resolve-Path to convert the relative path to an absolute path, but my actual script used an absolute path anyways, so why bother. It is much less code than the first hack (when you include the redirects and file reads) and still remains firmly grounded in the land of scripting. It's all about choosing the lesser evil at this point, so this is the solution that I ended up using.

Ultimately, I spent entirely too much time to come up with a solution that I am not happy with. I took the fact that it worked at all as a victory. If anybody out there has a better solution, **_please_** drop me a comment!

__P.S. Please pardon the horizontal scrolls on the code blocks, I thought it best to leave the commands and output unchanged__
