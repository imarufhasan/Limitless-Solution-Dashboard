import { Button, Form, Input, InputNumber, Modal, Radio } from "antd";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateMetalMutation, useUpdateMetalMutation } from "../redux/api/metalApi";


const AddEditMetalModal = ({ open, onClose, editingMetal }) => {
  const [form] = Form.useForm();
  const isEdit = !!editingMetal;

  const [createMetal, { isLoading: isCreating }] = useCreateMetalMutation();
  const [updateMetal, { isLoading: isUpdating }] = useUpdateMetalMutation();
  const isSaving = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (open && editingMetal) {
      form.setFieldsValue({
        name: editingMetal.name,
        price: editingMetal.price,
        unit: editingMetal.unit,
      });
    } else {
      form.resetFields();
    }
  }, [open, editingMetal]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await updateMetal({ id: editingMetal._id, ...values }).unwrap();
        toast.success("Metal updated successfully");
      } else {
        await createMetal(values).unwrap();
        toast.success("Metal created successfully");
      }
      form.resetFields();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save metal");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={false}
      centered
      width={560}
      closable={false}
    >
      <h2 className="text-[18px] font-semibold text-[#111827] mb-5">
        {isEdit ? "Edit Metal" : "Add New Metal"}
      </h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Metal Name */}
        <Form.Item
          label={
            <span className="text-[13px] font-medium text-[#111827]">
              Metal Name
            </span>
          }
          name="name"
          rules={[{ required: true, message: "Please enter metal name" }]}
        >
          <Input placeholder="e.g. Silver, Copper..." className="h-10.5 rounded-xl" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label={
            <span className="text-[13px] font-medium text-[#111827]">
              Price
            </span>
          }
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            className="w-full! h-10.5!"
            placeholder="0"
            min={0}
            prefix="$"
          />
        </Form.Item>

        {/* Unit */}
        <Form.Item
          label={
            <span className="text-[13px] font-medium text-[#111827]">
              Unit
            </span>
          }
          name="unit"
          rules={[{ required: true, message: "Please select a unit" }]}
        >
          <Radio.Group>
            <Radio.Button
              value="kg"
              className="rounded-l-xl! font-medium text-sm"
            >
              KG
            </Radio.Button>
            <Radio.Button value="lb" className="font-medium text-sm">
              LB
            </Radio.Button>
            <Radio.Button
              value="pc"
              className="rounded-r-xl! font-medium text-sm"
            >
              PC
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button
            htmlType="submit"
            loading={isSaving}
            className="h-10.5! rounded-xl! bg-[#652D8B]! hover:bg-[#5b21b6]! text-white! border-none! font-medium!"
          >
            {!isSaving && (
              <div className="flex items-center gap-2">
                <Save size={16} />
                {isEdit ? "Update" : "Save"}
              </div>
            )}
          </Button>

          <Button
            onClick={onClose}
            disabled={isSaving}
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