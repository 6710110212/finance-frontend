import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, InputNumber } from 'antd';

export default function EditItem({ isOpen, item, onItemEdited, onCancel }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpen && item) {
            form.setFieldsValue(item);
        }
    }, [isOpen, item, form]);

    const handleFormSubmit = () => {
        form.validateFields()
            .then((formData) => {
                onItemEdited(formData);
                form.resetFields();
            })
            .catch((errorinfo) => {
                console.error('Validate Failed:', errorinfo);
            });
    };

    return (
        <Modal
            title="Edit Item"
            open={isOpen}
            onOk={handleFormSubmit}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
        >
            <Form form={form} layout="vertical" >

                <Form.Item
                    name="type"
                    label="ชนิด"
                    rules={[{ required: true }]}
                >
                    <Select
                        allowClear
                        style={{ width: "100px" }}
                        options={[
                            {
                                value: 'income',
                                label: 'รายรับ',
                            },
                            {
                                value: 'expense',
                                label: 'รายจ่าย',
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="จำนวนเงิน"
                    rules={[{ required: true, message: 'กรุณาระบุจำนวนเงิน' }]}
                >
                    <InputNumber placeholder="จำนวนเงิน" />
                </Form.Item>

                <Form.Item
                    name="note"
                    label="หมายเหตุ"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Note" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
