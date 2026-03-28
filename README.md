# katischuo

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