---
layout: post
title: Learning PowerShell, Pitfalls for C# developers - Part 1
date: 2013-01-30 23:52:34.000000000 -05:00
category: coding
tags:
    - PowerShell
    - Scripting
author: Kevin Burdett
---
I recently had the opportunity to learn PowerShell. We decided to use it to manage our deployment scripts as it offers a number of huge improvements over traditional batch scripting in Windows. Overall, I am pretty impressed with it. I'm still confused as to why Microsoft insists on setting the execution policy such that you cannot execute unsigned scripts by default, but that's a discussion for a different day. I ran into a couple of pitfalls while learning. They seem to be pretty common for developers more familiar with C-style syntax like myself, so I thought I would share.

For the first part, I'll dig into function outputs. I had some difficulty with a function producing strange output, or at least it seemed strange. Consider the following example (contrived, but suprisingly close to my actual usage):

```powershell
function CreateSemaphoreFile ($drive)
{
    $path = "${drive}:\temp\lock"
    New-Item $path -Type File
    Set-Content $path "$env:USERNAME @ $env:COMPUTERNAME"
    return $path
}

Write-Host (CreateSemaphoreFile "C")
```

This outputs:

    C:\temp\lock C:\temp\lock

This definitely caught me by surprise. Due to the return statement, I expected the output to be this:

    C:\temp\lock

This sent me on a wild goose chase searching for where my variable was magically reassigned. After some research, I discovered that the reason for this is actually pretty straightforward, and had nothing to do with the value in "path". In PowerShell, a function's output isn't determined by the return statement. Instead, the output of a function is simply any _uncaptured_ output that originates from within that function. The return statement is just adding the value of "path" to the output before exiting the function. This is pretty much what you'd expect from a return statement. However, it turns out that New-Item Cmdlet _also_ has an output. It happens to be the path of the item that it just created. Since this output is not captured, it is added to the output of CreateSemaphoreFile. Hence, the value of "path" ends up in the function's output twice. So how do we fix this? We could just remove the return statement. That is probably the simplest option, but what if our function was more complex and we wanted to return something different? Easy, we just have to capture the output of New-Item somewhere. Since we aren't going to use it, the simplest way is just to redirect it to null like this:

```powershell
function CreateSemaphoreFile ($drive)
{
    $path = "${drive}:\temp\lock"
    New-Item $path -Type File > $NULL
    Set-Content $path "$env:USERNAME @ $env:COMPUTERNAME"
    return "something else"
}

Write-Host (CreateSemaphoreFile "C")
```

Output:

    something else

And there it is! Simple right? Just a bit different for a C# guy like me! More to come in Part 2 on parenthesis.
