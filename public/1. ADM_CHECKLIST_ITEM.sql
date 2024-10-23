CREATE SEQUENCE ADM_CHECKLIST_ITEM_SEQ MINVALUE 1 START WITH 1 INCREMENT BY 1 CACHE 20;	

CREATE TABLE ADM_CHECKLIST_ITEM ( 
CLI_ID NUMBER DEFAULT ADM_CHECKLIST_ITEM_SEQ.NEXTVAL,
CLITEM_CODE VARCHAR2(50),
CLITEM_NAME NVARCHAR2(255),
CLITEM_DOCSTYPE VARCHAR2(20),
CLITEM_DOCSTYPE_NAME NVARCHAR2(255),
CLITEM_REQUIRE VARCHAR2(20),
CLITEM_REQUIRE_NAME NVARCHAR2(255),
CLITEM_TIME_SUPPLY VARCHAR2(20),
CLITEM_ADDTIME_PRESCRIBED NUMBER,
CLITEM_STATUS NUMBER,
CLITEM_NOTE NVARCHAR2(255),
USER_CREATED VARCHAR2(50),
DATE_CREATED DATE,
USER_UPDATED VARCHAR2(50),
DATE_UPDATED DATE
);

CREATE INDEX ADM_CHECKLIST_ITEM_IDX ON ADM_CHECKLIST_ITEM(CLITEM_CODE);

ALTER TABLE ADM_CHECKLIST_ITEM ADD CONSTRAINT ADM_CHECKLIST_ITEM_PK PRIMARY KEY (CLITEM_CODE)
USING INDEX ADM_CHECKLIST_ITEM_IDX  ENABLE;

COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_GROUP.CLG_ID IS '';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_CODE IS 'Mã checklist';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_NAME IS 'Tên checklist';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_DOCSTYPE IS 'Loại chứng từ';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_DOCSTYPE_NAME IS 'Tên loại chứng từ';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_REQUIRE IS 'Bắt buộc';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_REQUIRE_NAME IS 'Bắt buộc (Tên)';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_TIME_SUPPLY IS 'Thời điểm cung cấp';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_ADDTIME_PRESCRIBED IS 'Thời gian bổ sung theo quy định (Ngày)';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_STATUS IS 'Trạng thái';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.CLITEM_NOTE IS 'Ghi chú';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.USER_CREATED IS 'Người tạo';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.DATE_CREATED IS 'Ngày tạo';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.USER_UPDATED IS 'Người cập nhật';
COMMENT ON COLUMN SAALEM.ADM_CHECKLIST_ITEM.DATE_UPDATED IS 'Ngày cập nhật';