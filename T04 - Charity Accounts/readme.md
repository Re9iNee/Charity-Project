# Task 4 - Basic Information Services - Charity Accounts

## Method 1 - Fetching charityAccounts table
- Start: 22 Farvardin 16:50
- End: 22 Farvardin 17:34


## Method 2 - Inserting into CharityAccounts table
 - Start: 23 Farvardin 20:00
 - End: 23 Farvardin 21:15


## Method 3 - Updating into CharityAccounts table
 - Start: 25 Farvardin
 - End: 25 Farvardin


## Method 4 - Deleting from CharityAccounts table
 - Start: 26 Farvardin 23:30
 - End: 27 Farvardin 17:00

## PostMan Documentation


 All Postman Requests for this table included:

  https://documenter.getpostman.com/view/6106774/TzCQa6DK#9de17519-f477-406e-bd66-7cf8461d7d52

 Postman Collection JSON:

 https://github.com/Re9iNee/Sabkad/blob/master/T04%20-%20Charity%20Accounts/Docs/SabkadV01.postman_collection.json

## Questions

<!--  1. Why Using Connection Pool?
  We don't want to overhead database with so many connections. we open one use it for multiple Queries. then close() connection when we don't need it.
2. Why resultLimit? 
 It is recommended to use SELECT TOP $(int) instead of Selecting and returning Everything from database.

3. Why Scope Identity?
 SQL Insertion won't return Id of the affected row. so by using SELCET Query right after insertion we can use CommonBaseTypeId and the return it.

 4. Why Using outputDependencies? 
 As in Issue #15
 > https://github.com/Re9iNee/Sabkad/issues/15#issue-852374633
 
  this method has one disadvatange that is: it contains bug when a primary key or 2 keys from a table make up to a foreign key. -->
