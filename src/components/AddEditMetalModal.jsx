import { Button, Form, Input, InputNumber, Modal } from "antd";
import { Save } from "lucide-react";
import React from "react";


const AddEditMetalModal = ({ open, onClose, isEdit }) => {
    const [form] = Form.useForm();

    const onFinish = (values => {
        console.log(values);

        form.resetFields();
        onClose();
    });

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={false}
            centered
            width={560}
            closable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    metalName: "Iron",
                    priceKg: 50,
                    pricePc: 0,
                }}
            >
                {/* Metal Name */}
                <Form.Item
                    label={
                        <span className="text-[13px] font-medium text-[#111827]">
                            Metal Name
                        </span>
                    }
                    name="metalName"
                    rules={[{ required: true, message: "Please enter metal name" }]}
                >
                    <Input
                        placeholder="Enter metal name"
                        className="h-10.5 rounded-xl"
                    />
                </Form.Item>

                {/* Price Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label={
                            <span className="text-[13px] font-medium text-[#111827]">
                                Price/KG 
                            </span>
                        }
                        name="priceKg"
                        rules={[{ required: true, message: "Enter KG price" }]}
                    >
                        <InputNumber
                        className="w-full! h-10.5!"
                        placeholder="0"
                    />
                </Form.Item>

                    <Form.Item
                        label={
                            <span className="text-[13px] font-medium text-[#111827]">
                                Price/PC 
                            </span>
                        }
                        name="pricePc"
                        rules={[{ required: true, message: "Enter PC price" }]}
                    >
                        <InputNumber
                            className="w-full! h-10.5!"
                            placeholder="0"
                        />
                    </Form.Item>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Button
                        htmlType="submit"
                        className="h-10.5! rounded-xl! bg-[#6C2BD9]! hover:bg-[#5b21b6]! text-white! border-none! font-medium!"
                    >
                        <div className="flex items-center gap-2">
                            <Save size={16} />
                            {isEdit ? "Update" : "Save"}
                        </div>
                    </Button>

                    <Button
                        onClick={onClose}
                        className="h-10.5! rounded-xl! bg-[#F3EDF9]! hover:bg-[#E9DDF8]! text-[#111827]! border-none! font-medium!"
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddEditMetalModal;