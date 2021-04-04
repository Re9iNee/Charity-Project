# Task 2 - Creating Constant Identifiers

## Method 1 - Fetching CommonBaseType table
- Start: 4 Farvardin 9:00
- End: 4 Farvardin 13:00


## Method 2 - Inserting into CommonBaseType table
 - Start: 5 Farvardin 12:52
 - End: 5 Farvardin 13:40


## Method 3 - Updating into CommonBaseType table
 - Start: 
 - End:

## Method 4 - Deleting from CommonBaseType table
 - Start: 
 - End:

## PostMan Documentation
 All Postman Requests for this table included:
  https://documenter.getpostman.com/view/6106774/TzCQa6DK#6aabc499-27dd-4775-a982-6aa6a29a4710
 Postman Collection JSON:
 /docs/SabkadV01.postman_collection.json

## Questions

 1. Why Using Connection Pool?
  We don't want to overhead database with so many connections. we open one use it for multiple Queries. then close() connection when we don't need it.
2. Why resultLimit? 
 It is recommended to use SELECT TOP $(int) instead of Selecting and returning Everything from database.

3. Why Scope Identity?
 SQL Insertion won't return Id of the affected row. so by using SELCET Query right after insertion we can use CommonBaseTypeId and the return it.


