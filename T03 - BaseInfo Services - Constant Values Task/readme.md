# Task 3 - Basic Information Services

## Method 1 - Fetching CommonBaseData table
- Start: 4 Farvardin 9:00
- End: 4 Farvardin 13:00


## Method 2 - Inserting into CommonBaseType table
 - Start: 16 Farvardin 11:56
 - End: 16 Farvardin 13:15
 - Modification #1 (generating key #35aa101): 40 Minutes on 17 Farvardin


## Method 3 - Updating into CommonBaseData table
 - Start: 17 Farvardin 13:02
 - End: 17 Farvardin 14:26


## Method 4 - Deleting from CommonBaseData table
 - Start: 17 Farvardin
 - End: 19 Farvardin 17:27

## PostMan Documentation


 All Postman Requests for this table included:

  https://documenter.getpostman.com/view/6106774/TzCQa6DK#8d8bd00c-dce0-4de4-ae86-4e6453bb9edb

 <!-- Postman Collection JSON: -->

 <!-- https://github.com/Re9iNee/Sabkad/blob/master/T02-Creating%20Constant%20Identifiers/docs/SabkadV01.postman_collection.json -->

## Questions

 1. Why Using Connection Pool?
  We don't want to overhead database with so many connections. we open one use it for multiple Queries. then close() connection when we don't need it.
2. Why resultLimit? 
 It is recommended to use SELECT TOP $(int) instead of Selecting and returning Everything from database.

3. Why Scope Identity?
 SQL Insertion won't return Id of the affected row. so by using SELCET Query right after insertion we can use CommonBaseTypeId and the return it.

 4. Why Using outputDependencies? 
 As in Issue #15 this method has one disadvatange that is: it contains bug when a primary key or 2 keys from a table make up to a foreign key.