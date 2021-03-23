CREATE TABLE tblPlans (
    PlanId int PRIMARY KEY NOT NULL,
    PlanName NVARCHAR(1000) NOT NULL,
    Description text,
    PlanNature BIT NOT NULL UNIQUE DEFAULT 1,
    ParentPlanId int UNIQUE,
    Icon VARBINARY(MAX),
    Fdate VARCHAR(10),
    Tdate VARCHAR(10),
    neededLogin BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Plans FOREIGN KEY (ParentPlanId) REFERENCES [SabkadV01].[dbo].[tblPlans](PlanId),
)