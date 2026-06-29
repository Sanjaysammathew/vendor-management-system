
     --   VENDOR MANAGEMENT SYSTEM - SQL SERVER


-- Create Database
CREATE DATABASE VendorManagementSystem;
GO

USE VendorManagementSystem;
GO


  -- USERS TABLE

CREATE TABLE Users
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    OrganizationName NVARCHAR(150) NOT NULL,

    Email NVARCHAR(150) NOT NULL UNIQUE,

    Password NVARCHAR(255) NOT NULL,

    GSTNumber NVARCHAR(15) NOT NULL UNIQUE,

    Role NVARCHAR(20) NOT NULL DEFAULT 'user',

    CreatedAt DATETIME DEFAULT GETDATE(),

    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO


 -- VENDOR DETAILS TABLE


CREATE TABLE VendorDetails
(
    Id INT IDENTITY(1,1) PRIMARY KEY,

    OrganizationName NVARCHAR(150) NOT NULL,

    Email NVARCHAR(150) NOT NULL,

    GSTNumber NVARCHAR(15) NOT NULL,

    LicenseNumber NVARCHAR(50) NOT NULL UNIQUE,

    Phone NVARCHAR(10) NOT NULL,

    ContactPerson NVARCHAR(100) NOT NULL,

    ContactDesignation NVARCHAR(100) NOT NULL,

    VendorType NVARCHAR(100) NOT NULL,

    Description NVARCHAR(MAX),

    Address NVARCHAR(MAX),

    Status NVARCHAR(20) DEFAULT 'pending',

    Remarks NVARCHAR(MAX),

    IsDeleted BIT DEFAULT 0,

    CreatedAt DATETIME DEFAULT GETDATE(),

    UpdatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Vendor_User
    FOREIGN KEY (GSTNumber)
    REFERENCES Users(GSTNumber)
);
GO


 -- ADMIN USER


INSERT INTO Users
(
OrganizationName,
Email,
Password,
GSTNumber,
Role
)
VALUES
(
'Admin',
'admin@gmail.com',
'Admin@123',
'33ABCDE1234F1Z5',
'admin'
);
GO


  -- SAMPLE USER


INSERT INTO Users
(
OrganizationName,
Email,
Password,
GSTNumber,
Role
)
VALUES
(
'SPK Groups',
'spkgroups@gmail.com',
'User@123',
'29ABCDE1234F1Z5',
'user'
);
GO

 -- SAMPLE VENDOR


INSERT INTO VendorDetails
(
OrganizationName,
Email,
GSTNumber,
LicenseNumber,
Phone,
ContactPerson,
ContactDesignation,
VendorType,
Description,
Address,
Status,
Remarks,
IsDeleted
)
VALUES
(
'SPK Groups',
'spkgroups@gmail.com',
'29ABCDE1234F1Z5',
'LIC10001',
'9876543210',
'Rahul',
'Manager',
'Electrical',
'Electrical Equipment Supplier',
'Coimbatore',
'Pending',
'',
0
);
GO


 --VIEWS


-- Users
CREATE VIEW vw_Users
AS
SELECT *
FROM Users;
GO

-- All Vendors
CREATE VIEW vw_AllVendors
AS
SELECT *
FROM VendorDetails;
GO

-- Active Vendors
CREATE VIEW vw_ActiveVendors
AS
SELECT *
FROM VendorDetails
WHERE IsDeleted = 0;
GO

-- Deleted Vendors
CREATE VIEW vw_DeletedVendors
AS
SELECT *
FROM VendorDetails
WHERE IsDeleted = 1;
GO

-- Pending Vendors
CREATE VIEW vw_PendingVendors
AS
SELECT *
FROM VendorDetails
WHERE Status='Pending'
AND IsDeleted=0;
GO

-- Approved Vendors
CREATE VIEW vw_ApprovedVendors
AS
SELECT *
FROM VendorDetails
WHERE Status='Approved'
AND IsDeleted=0;
GO

-- Rejected Vendors
CREATE VIEW vw_RejectedVendors
AS
SELECT *
FROM VendorDetails
WHERE Status='Rejected'
AND IsDeleted=0;
GO


  --DASHBOARD COUNT VIEW


CREATE VIEW vw_DashboardCounts
AS
SELECT

COUNT(CASE WHEN IsDeleted=0 THEN 1 END) AS TotalVendors,

COUNT(CASE WHEN Status='Approved' AND IsDeleted=0 THEN 1 END)
AS Approved,

COUNT(CASE WHEN Status='Pending' AND IsDeleted=0 THEN 1 END)
AS Pending,

COUNT(CASE WHEN Status='Rejected' AND IsDeleted=0 THEN 1 END)
AS Rejected

FROM VendorDetails;
GO

 --INDEXES


-- USERS TABLE
CREATE INDEX IX_Users_Email
ON Users(Email);

CREATE INDEX IX_Users_GSTNumber
ON Users(GSTNumber);

CREATE INDEX IX_Users_Role
ON Users(Role);

GO

-- VENDOR DETAILS TABLE

CREATE INDEX IX_Vendor_GSTNumber
ON VendorDetails(GSTNumber);

CREATE INDEX IX_Vendor_Status
ON VendorDetails(Status);

CREATE INDEX IX_Vendor_IsDeleted
ON VendorDetails(IsDeleted);

CREATE INDEX IX_Vendor_VendorType
ON VendorDetails(VendorType);

CREATE INDEX IX_Vendor_LicenseNumber
ON VendorDetails(LicenseNumber);

CREATE INDEX IX_Vendor_CreatedAt
ON VendorDetails(CreatedAt);

CREATE INDEX IX_Vendor_Status_IsDeleted
ON VendorDetails(Status, IsDeleted);

GO


 -- TEST QUERIES


SELECT * FROM Users;

SELECT * FROM VendorDetails;

SELECT * FROM vw_Users;

SELECT * FROM vw_AllVendors;

SELECT * FROM vw_ActiveVendors;

SELECT * FROM vw_DeletedVendors;

SELECT * FROM vw_PendingVendors;

SELECT * FROM vw_ApprovedVendors;

SELECT * FROM vw_RejectedVendors;

SELECT * FROM vw_DashboardCounts;
GO

  -- SQL QUERIES


-- 1. Display All Records
SELECT *
FROM VendorDetails;


-- 2. Display Active Records
SELECT *
FROM VendorDetails
WHERE IsDeleted = 0;


-- 3. Display Inactive (Deleted) Records
SELECT *
FROM VendorDetails
WHERE IsDeleted = 1;


-- 4. Search by Organization Name
SELECT *
FROM VendorDetails
WHERE OrganizationName LIKE '%SPK%';


-- 5. Count Total Active Records
SELECT COUNT(*) AS TotalRecords
FROM VendorDetails
WHERE IsDeleted = 0;


-- 6. Count Records by Status
SELECT
    Status,
    COUNT(*) AS Total
FROM VendorDetails
WHERE IsDeleted = 0
GROUP BY Status;


-- 7. Display Recently Added Records (Latest 5)
SELECT TOP 5 *
FROM VendorDetails
ORDER BY CreatedAt DESC;


-- 8. Display Records Within Date Range
SELECT *
FROM VendorDetails
WHERE CreatedAt BETWEEN '2026-01-01' AND '2026-12-31';


-- 9. Display Top 5 Records
SELECT TOP 5 *
FROM VendorDetails
ORDER BY Id ASC;


-- 10. Summary Report
SELECT
    COUNT(*) AS TotalVendors,

    SUM(CASE WHEN Status='Pending' AND IsDeleted=0 THEN 1 ELSE 0 END) AS Pending,

    SUM(CASE WHEN Status='Approved' AND IsDeleted=0 THEN 1 ELSE 0 END) AS Approved,

    SUM(CASE WHEN Status='Rejected' AND IsDeleted=0 THEN 1 ELSE 0 END) AS Rejected,

    SUM(CASE WHEN IsDeleted=1 THEN 1 ELSE 0 END) AS Deleted

FROM VendorDetails;
