CREATE TABLE tblCommonBaseType (
    CommonBaseTypeId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    BaseTypeTitle nvarchar(800) NOT NULL UNIQUE,
    BaseTypeCode varchar(3) UNIQUE,
);