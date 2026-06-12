import { useState } from "react";
import { Card, Tag, Typography, Divider, Image, Tooltip, Spin } from "antd";
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
  BoxPlotOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery } from "../redux/api/orderApi";

const { Text, Title } = Typography;

const STATUS_COLORS = {
  pending: "gold",
  assigned: "blue",
  completed: "green",
  cancelled: "red",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionCard({ icon, title, children }) {
  return (
    <div className="mb-6">
      <Card
        className="rounded-xl"
        styles={{ body: { padding: "20px 24px" } }}
        style={{
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-600 text-base">{icon}</span>
          <span className="font-semibold text-gray-800 text-base">{title}</span>
        </div>

        {children}
      </Card>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text className="text-xs text-gray-400">{label}</Text>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-gray-400 text-xs">{icon}</span>}
        <Text className="text-sm font-medium text-gray-800">
          {value ?? "—"}
        </Text>
      </div>
    </div>
  );
}

// ─── Customer section ─────────────────────────────────────────────────────────

function CustomerSection({ d }) {
  const isPickup = d.deliveryType === "pickup";
  const address = isPickup ? d.pickupAddress : d.customerAddress;

  return (
    <SectionCard icon={<UserOutlined />} title="Customer details">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <InfoRow label="Name" value={d.customerName} />
        <InfoRow
          label="Phone"
          value={d.customerPhone}
          icon={<PhoneOutlined />}
        />
        <InfoRow
          label="Requested at"
          value={fmt(d.orderRequestedAt)}
          icon={<CalendarOutlined />}
        />
        {d.preferredDate && (
          <InfoRow
            label="Preferred date"
            value={fmt(d.preferredDate)}
            icon={<ClockCircleOutlined />}
          />
        )}
        <InfoRow
          label="Delivery type"
          value={isPickup ? "Pickup from location" : "Drop-off"}
        />
      </div>

      <Divider className="my-4" style={{ borderColor: "#f3f4f6" }} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <MailOutlined className="text-gray-400 text-xs" />
          <Text className="text-sm text-gray-800">{d.customerEmail}</Text>
        </div>
        {address && (
          <div className="flex items-start gap-1.5">
            <EnvironmentOutlined className="text-gray-400 text-xs mt-0.5" />
            <Text className="text-sm text-gray-800">{address}</Text>
          </div>
        )}
        {d.additionalNotes && (
          <div>
            <Text className="text-xs text-gray-400 block mb-1">Notes</Text>
            <div className="flex items-center gap-1.5">
              <FileTextOutlined className="text-gray-400 text-xs" />
              <Text className="text-sm text-gray-600 italic">
                {d.additionalNotes}
              </Text>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Vehicle section ──────────────────────────────────────────────────────────

function VehicleSection({ d }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!d.vinNumber) return;
    navigator.clipboard.writeText(d.vinNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionCard icon={<CarOutlined />} title="Vehicle information">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <InfoRow
          label="Model"
          value={`${d.model ?? "—"} ${d.year ? `(${d.year})` : ""}`}
        />
        <div className="flex flex-col gap-0.5">
          <Text className="text-xs text-gray-400">VIN number</Text>
          <div className="flex items-center gap-2">
            <Text className="text-sm font-medium text-gray-800">
              {d.vinNumber}
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

      {d.spcs && (
        <>
          <Divider className="my-4" style={{ borderColor: "#f3f4f6" }} />
          <Text className="text-xs text-gray-500 font-medium block mb-3">
            Weight specs
          </Text>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <InfoRow
              label="Total weight"
              value={`${d.spcs.weightLbs?.toLocaleString()} lbs`}
            />
            <InfoRow
              label="Aluminum"
              value={`${d.spcs.aluminumWeightLbs} lbs`}
            />
            <InfoRow label="Wheels" value={`${d.spcs.wheelWeightLbs} lbs`} />
            <InfoRow label="Battery" value={`${d.spcs.batteryWeightLbs} lbs`} />
            <InfoRow
              label="Breakage"
              value={`${d.spcs.breakageWeightLbs} lbs`}
            />
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ─── Materials section ────────────────────────────────────────────────────────

function MaterialsSection({ d }) {
  return (
    <SectionCard icon={<BoxPlotOutlined />} title="Material details & pricing">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="text-left pb-2 font-medium">Item</th>
            <th className="text-right pb-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {(d.items ?? []).map((item, i) => (
            <tr key={i} className="border-b border-gray-50">
              <td className="py-2">
                <Text className="text-sm font-medium text-gray-800">
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-400 block">
                  {item.quantity} {item.unit} × ${item.price}
                </Text>
              </td>
              <td className="py-2 text-right">
                <Text className="text-sm font-medium text-gray-800">
                  ${(item.quantity * item.price).toLocaleString()}
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-3 text-sm font-medium text-gray-800">
              Materials total
            </td>
            <td className="pt-3 text-right text-sm font-semibold text-purple-600">
              ${(d.subTotal ?? 0).toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </SectionCard>
  );
}

// ─── Offer summary ────────────────────────────────────────────────────────────

function OfferSummary({ d }) {
  const isVehicle = d.orderType === "Vehicle";

  return (
    <div
      className="rounded-xl p-5 mb-4"
      style={{
        background: "linear-gradient(135deg, #6F3A92 80%, #9F8AD4 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileTextOutlined style={{ color: "#d8b4fe", fontSize: 14 }} />
        <span className="text-white font-semibold text-xl">Offer summary</span>
      </div>

      {isVehicle ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <p className="text-white text-sm">Quoted price</p>
            <p className="text-white text-sm font-medium">
              ${(d.qoutedPrice ?? 0).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-sm">Pickup fee</p>
            <p className="text-white text-sm font-medium">
              ${(d.pickupPrice ?? 0).toLocaleString()}
            </p>
          </div>
          <Divider
            style={{ borderColor: "rgba(255,255,255,0.2)", margin: "12px 0" }}
          />
          <p className="text-white text-xs mb-1">Total offer</p>
          <p
            className="text-white font-bold"
            style={{ fontSize: 26, lineHeight: 1.2 }}
          >
            ${(d.totalPrice ?? 0).toLocaleString()}
          </p>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-white text-sm">Materials total</p>
            <p className="text-white text-sm font-medium">
              ${(d.subTotal ?? 0).toLocaleString()}
            </p>
          </div>
          <Divider
            style={{ borderColor: "rgba(255,255,255,0.2)", margin: "12px 0" }}
          />
          <p className="text-white text-xs mb-1">Calculated offer</p>
          <p
            className="text-white font-bold"
            style={{ fontSize: 26, lineHeight: 1.2 }}
          >
            ${(d.subTotal ?? 0).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}

// ─── Dates card ───────────────────────────────────────────────────────────────

function DatesCard({ d }) {
  return (
    <Card
      className="rounded-xl shadow-none"
      styles={{ body: { padding: "16px 20px" } }}
      style={{ border: "1px solid #e5e7eb" }}
    >
      <Text className="text-xs text-gray-400 block mb-3">Order dates</Text>
      <div className="flex flex-col gap-3">
        <InfoRow label="Requested at" value={fmtDateTime(d.orderRequestedAt)} />
        {d.preferredDate && (
          <InfoRow
            label="Preferred pickup"
            value={fmtDateTime(d.preferredDate)}
          />
        )}
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewQuotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useGetOrderByIdQuery(id);
  const d = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !d) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl p-5 m-6 text-sm">
        Failed to load order details. Please try again.
      </div>
    );
  }

  const isVehicle = d.orderType === "Vehicle";

  return (
    <div className="bg-gray-50 px-4 py-6 md:px-8 rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeftOutlined style={{ fontSize: 13 }} />
        <span>Back to dashboard</span>
      </button>

      <div className="mb-5">
        <Title level={4} className="!mb-1 !text-gray-900">
          Review quote request
        </Title>
        <div className="flex items-center gap-2">
          <Text className="text-xs text-gray-400">
            Order:{" "}
            <span className="text-gray-600 font-medium">{d.orderNumber}</span>
          </Text>
          <Tag
            style={{
              fontSize: 11,
              padding: "0 8px",
              borderRadius: 20,
              border: "none",
              background: "#f3eafe",
              color: "#7c3aed",
            }}
          >
            {d.orderType}
          </Tag>
          <Tag
            color={STATUS_COLORS[d.status] ?? "default"}
            style={{
              fontSize: 11,
              padding: "0 8px",
              borderRadius: 20,
              border: "none",
            }}
          >
            {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
          </Tag>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          <CustomerSection d={d} />
          {isVehicle ? <VehicleSection d={d} /> : <MaterialsSection d={d} />}

          {(d.attachments ?? []).length > 0 && (
            <SectionCard icon={<PictureOutlined />} title="Attachments">
              <div className="flex gap-3">
                <Image.PreviewGroup>
                  {d.attachments.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      width="100%"
                      height={200}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                      className="cursor-pointer"
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right column */}
        <div className="md:w-72 shrink-0">
          <OfferSummary d={d} />
          <DatesCard d={d} />
        </div>
      </div>
    </div>
  );
}
