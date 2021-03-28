CREATE TABLE tblPlans (
    PlanId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    PlanName NVARCHAR(1000) NOT NULL,
    Description text,
    PlanNature BIT NOT NULL DEFAULT 1,
    ParentPlanId int,
    Icon VARBINARY(MAX),
    Fdate VARCHAR(10),
    Tdate VARCHAR(10),
    neededLogin BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Plans FOREIGN KEY (ParentPlanId) REFERENCES [SabkadV01].[dbo].[tblPlans](PlanId),
    UNIQUE (PlanName, PlanNature, ParentPlanId),
)