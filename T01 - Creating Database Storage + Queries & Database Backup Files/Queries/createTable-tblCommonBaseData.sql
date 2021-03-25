CREATE TABLE tblCommonBaseData (
    CommonBaseDataId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    BaseCode VARCHAR(6),
    BaseValue NVARCHAR(800),
    CommonBaseTypeId int,
    CONSTRAINT FK_CommonBaseData FOREIGN KEY (CommonBaseTypeId)
    REFERENCES [SabkadV01].[dbo].[tblCommonBaseType]
)