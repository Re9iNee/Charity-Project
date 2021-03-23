CREATE TABLE tblCommonBaseType (
    CommonBaseTypeId int PRIMARY KEY NOT NULL,
    BaseTypeTitle nvarchar(800) NOT NULL UNIQUE,
    BaseTypeCode varchar(3) UNIQUE,
);