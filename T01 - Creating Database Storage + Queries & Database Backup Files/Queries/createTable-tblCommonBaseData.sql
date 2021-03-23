CREATE TABLE tblCommonBaseData (
    CommonBaseDataId int PRIMARY KEY NOT NULL,
    BaseCode VARCHAR(6),
    BaseValue NVARCHAR(800),
    CommonBaseTypeId int,
    CONSTRAINT FK_CommonBaseData FOREIGN KEY (CommonBaseTypeId)
    REFERENCES [SabkadV01].[dbo].[tblCommonBaseType]
)