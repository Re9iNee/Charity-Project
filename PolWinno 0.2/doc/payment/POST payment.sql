-- All Columns
  INSERT INTO [SabkadV01].[dbo].[tblPayment] 
  (CashAssistanceDetailId, PaymentPrice, PaymentDate, PaymentTime, PaymentStatus, TargetAccountNumber, CharityAccountId, FollowCode, PaymentGatewayId, SourceAccountNumber, NeedyId, DonatorId)
   VALUES (1, 100, '2020-01-01', '13:43', 'Successful', '5022', 1, '2000123', 2, '6037', 1, 1);
-- Not null Columns only
  INSERT INTO [SabkadV01].[dbo].[tblPayment] 
  (CashAssistanceDetailId, PaymentPrice, PaymentDate, PaymentTime, PaymentStatus, TargetAccountNumber, CharityAccountId, FollowCode)
   VALUES (1, 100, '2020-01-01', '13:43', 'Failed', '5022', 1, '2000123');