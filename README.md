# katischuo

```
NOTE FOR USERS AND REVIEWERS

This app is not in a fully finished state! Admittedly,
I got severely burned out over the past few weeks,
so not all functionality has been implemented.
All core functionality needed for it to be *functional* is there,
but there are occasional visual bugs which I might have forgotten.
Please remind me on Slack or make an issue if there's something that needs to be fixed.

Je vous remercie beaucoup!

This is also an app that I personally use often,
so if something's broken and I need to fix it,
I will notice.

I don't like using broken things very much
but I'm also tired
so I'll fix it at some point

Thanks!

```

## κατισχύω
> *v.* To overpower, to prevail, to be strong against, to overcome.

An extendable gym tracking app/API, intended to be both minimalist and maximalist at the same time.
Built under time crunch for my Campfire Flagship stipend hours, so it's not the most polished or 
finished. However, in its current state, it is (mostly) functional and all core functionalities are
here.

API keys have not yet been implemented, therefore so far all APIs are internal only. I plan to change this
as soon as I can. 

# API Reference
## GET /api/bismarck
Will return the first 2 lines of Bismarck by Sabaton.
### Arguments
None
### Response
```
{
    body: "From the mist, a shape, a ship is taking form / And the silence of the sea is about to drift into a storm\n"
}
```

## POST /api/create-new-exercise

ykw im writing this documentation later
