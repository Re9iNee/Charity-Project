CREATE TABLE tblPersonal (
    PersonId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    Name NVARCHAR(500) NOT NULL,
    Family NVARCHAR(500) NOT NULL,
    NationalCode VARCHAR(10),
    IdNumber varchar(10),
    Sex BIT NOT NULL DEFAULT 0,
    BirthDate varchar(10),
    BirthPlace NVARCHAR(500),
    PersonType TINYINT NOT NULL,
    PersonPhoto VARBINARY(MAX),
    SecretCode NVARCHAR(20),
)