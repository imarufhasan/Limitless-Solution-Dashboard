import { useState } from "react";
import { Card, Tag, Typography, Divider, Image, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  CarOutlined,
  PictureOutlined,
  PhoneOutlined,
  CalendarOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const customerData = {
  requestId: "#000001",
  tag: "Junk Car",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  date: "Jan 15, 2024",
  pickupType: "Pickup from Location",
  email: "rajesh.kumar@email.com",
  address: "123 MG Road, Bangalore, Karnataka 560001",
  notes: "Car has minor damage on front bumper",
};

const vehicleData = {
  vehicle: "Car",
  vinNumber: "1HGBH41JXMN109186",
};

const offerData = {
  materialsTotal: 30275,
  pickupFee: 60,
  calculatedOffer: 30325,
};

const carImages = [
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80",
];

function SectionCard({ icon, title, children }) {
  return (
    <Card
      className="mb-4 rounded-xl shadow-none"
      styles={{ body: { padding: "20px 24px" } }}
      style={{ border: "1px solid #e5e7eb" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-600 text-base">{icon}</span>
        <span className="font-semibold text-gray-800 text-base">{title}</span>
      </div>
      {children}
    </Card>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text className="text-xs text-gray-400">{label}</Text>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-gray-400 text-xs">{icon}</span>}
        <Text className="text-sm font-medium text-gray-800">{value}</Text>
      </div>
    </div>
  );
}

export default function ReviewQuotePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(vehicleData.vinNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" bg-gray-50 px-4 py-6 md:px-8 rounded-lg">
      <div className="">
        {/* Back */}
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors">
          <ArrowLeftOutlined style={{ fontSize: 13 }} />
          <span>Back to Dashboard</span>
        </button>

        {/* Page Title */}
        <div className="mb-5">
          <Title level={4} className="!mb-1 !text-gray-900">
            Review Quote Request
          </Title>
          <div className="flex items-center gap-2">
            <Text className="text-xs text-gray-400">
              Request ID: <span className="text-gray-600 font-medium">{customerData.requestId}</span>
            </Text>
            <Tag
              color="purple"
              style={{
                fontSize: 11,
                padding: "0 8px",
                borderRadius: 20,
                border: "none",
                background: "#f3eafe",
                color: "#7c3aed",
              }}
            >
              {customerData.tag}
            </Tag>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Customer Details */}
            <SectionCard icon={<UserOutlined />} title="Customer Details">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Name" value={customerData.name} />
                <InfoRow
                  label="Phone"
                  value={customerData.phone}
                  icon={<PhoneOutlined />}
                />
                <InfoRow
                  label="Date"
                  value={customerData.date}
                  icon={<CalendarOutlined />}
                />
                <InfoRow label="Pickup Type" value={customerData.pickupType} />
              </div>

              <Divider className="my-4" style={{ borderColor: "#f3f4f6" }} />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <MailOutlined className="text-gray-400 text-xs" />
                  <Text className="text-sm text-gray-800">{customerData.email}</Text>
                </div>
                <div className="flex items-start gap-1.5">
                  <EnvironmentOutlined className="text-gray-400 text-xs mt-0.5" />
                  <Text className="text-sm text-gray-800">{customerData.address}</Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-400 block mb-1">Notes</Text>
                  <div className="flex items-center gap-1.5">
                    <FileTextOutlined className="text-gray-400 text-xs" />
                    <Text className="text-sm text-gray-600 italic">{customerData.notes}</Text>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Vehicle Information */}
            <SectionCard icon={<CarOutlined />} title="Vehicle Information">
              <div className="grid grid-cols-2 gap-x-8">
                <InfoRow label="Vehicle" value={vehicleData.vehicle} />
                <div className="flex flex-col gap-0.5">
                  <Text className="text-xs text-gray-400">VIN Number</Text>
                  <div className="flex items-center gap-2">
                    <Text className="text-sm font-medium text-gray-800">
                      {vehicleData.vinNumber}
                    </Text>
                    <Tooltip title={copied ? "Copied!" : "Copy VIN"}>
                      <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {copied ? (
                          <CheckOutlined style={{ fontSize: 12 }} />
                        ) : (
                          <CopyOutlined style={{ fontSize: 12 }} />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Images */}
            <SectionCard icon={<PictureOutlined />} title="Images">
              <div className="flex gap-3">
                <Image.PreviewGroup>
                  {carImages.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      width={"100%"}
                      height={300}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                      className="cursor-pointer"
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </SectionCard>
          </div>

          {/* Right Column — Offer Summary */}
          <div className="md:w-xl shrink-0">
            <div
              className="rounded-xl p-5"
              style={{
                background: "linear-gradient(135deg, #6F3A92 80%, #9F8AD4 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileTextOutlined style={{ color: "#d8b4fe", fontSize: 14 }} />
                <span className="text-white font-semibold text-xl">
                  Offer Summary
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <p className="text-white text-md">Materials Total</p>
                <p className="text-white text-md font-medium">
                  ${offerData.materialsTotal.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-white text-md">Pickup Fee</p>
                <p className="text-white text-md font-medium">
                  ${offerData.pickupFee}
                </p>
              </div>

              <Divider style={{ borderColor: "rgba(255,255,255,0.2)", margin: "12px 0" }} />

              <div>
                <p className="text-white text-xs block mb-1">
                  Calculated Offer
                </p>
                <p
                  className="text-white font-bold"
                  style={{ fontSize: 26, lineHeight: 1.2 }}
                >
                  ${offerData.calculatedOffer.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}