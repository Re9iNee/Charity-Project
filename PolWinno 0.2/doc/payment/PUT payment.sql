UPDATE [SabkadV01].[dbo].[tblPayment] 
SET PaymentPrice = 2.2, PaymentGatewayId=1, DonatorId=1, CashAssistanceDetailId=1, PaymentDate='2020-12-30', PaymentTime='13:48', PaymentStatus='Failed', SourceAccountNumber='5022', TargetAccountNumber='6037', CharityAccountId=NULL, FollowCode=200020, NeedyId=1 
WHERE PaymentId = 5;