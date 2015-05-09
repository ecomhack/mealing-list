# mealing-list

a [Sails](http://sailsjs.org) application

# API

## Landing Pages & General Organizing

```
Create Event: POST /event
{ title, date, location } -> { [values], shortlink, id }
```

```
Update Event: PUT /event
{ title, date, location }
```

```
Create User: POST /participant
{ name } -> { name, id }
```

```
Join Event: POST /event/:eventid/participants/:userid
```

## Dish Management

```
Create Dish for Event: POST /event/:eventid/dishes
{ name?, locked[bool, whether private], creator[userid] } -> { [values], id }
```

```
Update Dish: PUT /dish/:dishid
{ name, locked }
```

```
Add Ingredient to Dish: POST /dish/:dishid/ingredients
{ title } -> ??? // TODO
```

```
Update Ingredient: PUT /ingredient/:ingredientid
{ title, weight, providedBy[userid] }
```
## Wireframing
http://y89vtr.axshare.com
