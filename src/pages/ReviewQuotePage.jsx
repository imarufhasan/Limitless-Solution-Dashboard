import { useState } from "react";
import {
  Card,
  Tag,
  Typography,
  Divider,
  Image,
  Tooltip,
  Spin,
  notification,
  Input,
  Avatar,
  Skeleton,
  Pagination,
} from "antd";
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
  CalculatorOutlined,
  SendOutlined,
  SearchOutlined,
  TeamOutlined,
  EnvironmentFilled,
} from "@ant-design/icons";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useSendMetalQuoteMutation,
  useSendVehicleQuoteMutation,
} from "../redux/api/orderApi";
import {
  useGetAvailableEmployeesQuery,
  useAssignEmployeeMutation,
} from "../redux/api/employeeApi";

const { Text, Title } = Typography;

const STATUS_COLORS = {
  pending: "gold",
  assigned: "blue",
  completed: "green",
  cancelled: "red",
  accepted: "cyan",
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
        style={{ border: "1px solid #e5e7eb", background: "#fff" }}
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

function OfferAcceptSendOffer({ d, orderId, onOfferSent }) {
  const [api, contextHolder] = notification.useNotification();
  const [mode, setMode] = useState("accept"); // "accept" | "counter"
  const [counterAmount, setCounterAmount] = useState("");
  const [sendMetalQuote, { isLoading: isSending }] =
    useSendMetalQuoteMutation();

  const materialsTotal = d?.subTotal ?? 0;

  const handleSend = async () => {
    try {
      const isCounter = mode === "counter";
      const body = {
        isCustom: isCounter,
        ...(isCounter && { qoutedPrice: Number(counterAmount) }),
      };
      const req = { id: orderId, body };
      console.log("metal req data: ", req);

      const res = await sendMetalQuote(req).unwrap();
      if (res?.success) {
        api.success({
          message: isCounter ? "Counter offer sent!" : "Offer accepted!",
          description: isCounter
            ? `Your counter offer of $${Number(counterAmount).toLocaleString()} has been sent.`
            : "The calculated offer has been accepted and sent to the customer.",
          placement: "topRight",
          duration: 3,
        });

        setTimeout(() => onOfferSent(), 1500);
      }
    } catch (err) {
      api.error({
        message: "Failed to send",
        description:
          err?.data?.message ?? "Something went wrong. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  const canSend =
    mode === "accept" || (mode === "counter" && counterAmount.trim() !== "");

  return (
    <>
      {contextHolder}
      <div
        className="rounded-xl p-5 mb-4"
        style={{
          background: "linear-gradient(135deg, #6F3A92 80%, #9F6AD4 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <FileTextOutlined style={{ color: "#d8b4fe", fontSize: 14 }} />
          <span className="text-white font-semibold text-base">
            Offer Summary
          </span>
        </div>

        {/* Make/Model label placeholder (metals don't have model) */}
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            marginBottom: 6,
          }}
        >
          Materials Total
        </p>

        {/* Big total */}
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <p
            style={{ color: "#fff", fontWeight: 700, fontSize: 28, margin: 0 }}
          >
            ${materialsTotal.toLocaleString()}
          </p>
        </div>

        {/* Breakdown */}
        <div className="flex justify-between items-center mb-1">
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
            Materials Total:
          </span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
            ${materialsTotal.toLocaleString()}
          </span>
        </div>

        <Divider
          style={{ borderColor: "rgba(255,255,255,0.2)", margin: "12px 0" }}
        />

        {/* Calculated offer */}
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            marginBottom: 4,
          }}
        >
          Calculated Offer
        </p>
        <p
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 28,
            margin: "0 0 16px",
          }}
        >
          ${materialsTotal.toLocaleString()}
        </p>

        {/* Toggle: Accept / Counter */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: 4,
            marginBottom: 16,
            gap: 4,
          }}
        >
          {["accept", "counter"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                border: "none",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "#6F3A92" : "rgba(255,255,255,0.75)",
                fontWeight: mode === m ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {m === "accept" ? "Accept Offer" : "Counter Offer"}
            </button>
          ))}
        </div>

        {/* Counter input */}
        {mode === "counter" && (
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                marginBottom: 6,
              }}
            >
              Your Counter Offer
            </label>
            <input
              type="number"
              placeholder="Enter your offer amount"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 8,
                padding: "10px 12px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleSend}
          disabled={!canSend || isSending}
          style={{
            width: "100%",
            background:
              !canSend || isSending ? "rgba(255,255,255,0.2)" : "#fff",
            color: !canSend || isSending ? "rgba(255,255,255,0.5)" : "#6F3A92",
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            fontSize: 14,
            fontWeight: 600,
            cursor: !canSend || isSending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity 0.2s",
          }}
        >
          {isSending ? (
            <Spin size="small" style={{ marginRight: 6 }} />
          ) : (
            <SendOutlined style={{ fontSize: 13 }} />
          )}
          {isSending
            ? "Sending…"
            : mode === "counter"
              ? "Send Counter Offer"
              : "Accept & Send Offer"}
        </button>
      </div>
    </>
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

// ─── Pricing Calculator ───────────────────────────────────────────────────────

function PricingCalculator({ d, orderId, onOfferSent }) {
  const [api, contextHolder] = notification.useNotification();
  const [sendVehicleQuote, { isLoading: isSending }] =
    useSendVehicleQuoteMutation();

  const [fields, setFields] = useState({
    makeModel: d?.model ?? "",
    year: String(d?.year ?? ""),
    weightLbs: String(d?.spcs?.weightLbs ?? ""),
    alumWheelLbs: String(d?.spcs?.aluminumWeightLbs ?? ""),
    wheelWeightLbs: String(d?.spcs?.wheelWeightLbs ?? ""),
    batteryLbs: String(d?.spcs?.batteryWeightLbs ?? ""),
    breakageLbs: String(d?.spcs?.breakageWeightLbs ?? ""),
    pickupFee: String(d?.pickupPrice ?? ""),
    carPrice: String(d?.qoutedPrice ?? ""),
  });

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const totalValue = parseFloat(fields.carPrice) || 0;
  const pickupFee = parseFloat(fields.pickupFee) || 0;
  const finalOffer = totalValue + pickupFee;

  const handleSendOffer = async () => {
    try {
      const num = (v) => Number(String(v).replace(/,/g, "")) || 0;

      const body = {
        model: fields.makeModel?.trim(),
        year: num(fields.year),
        weightLbs: num(fields.weightLbs),
        aluminumWeightLbs: num(fields.alumWheelLbs),
        wheelWeightLbs: num(fields.wheelWeightLbs),
        batteryWeightLbs: num(fields.batteryLbs),
        breakageWeightLbs: num(fields.breakageLbs),
        pickupPrice: num(fields.pickupFee),
        qoutedPrice: num(fields.carPrice),
      };

      await sendVehicleQuote({ id: orderId, body }).unwrap();

      api.success({
        message: "Offer sent successfully!",
        description: `Final offer of $${finalOffer.toLocaleString()} has been sent to the customer.`,
        placement: "topRight",
        duration: 3,
      });

      setTimeout(() => onOfferSent(), 1500);
    } catch (err) {
      api.error({
        message: "Failed to send offer",
        description:
          err?.data?.message ?? "Something went wrong. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  };

  const field = (label, key, placeholder) => (
    <div key={key}>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        placeholder={placeholder}
        value={fields[key]}
        onChange={set(key)}
      />
    </div>
  );

  return (
    <>
      {contextHolder}
      <div
        className="rounded-xl p-5 mb-4"
        style={{
          background: "linear-gradient(160deg, #6F3A92 60%, #9F6AD4 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <CalculatorOutlined style={{ color: "#d8b4fe", fontSize: 15 }} />
          <span className="text-white font-semibold text-base">
            Pricing Calculator
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {field("Make / Model", "makeModel", "Chevy Tahoe")}
          {field("Year", "year", "2008")}
          {field("Weight (lbs)", "weightLbs", "5,200")}
          {field("Alum. Weight lbs", "alumWheelLbs", "84")}
          {field("Wheel Weight lbs", "wheelWeightLbs", "60")}
          {field("Battery lbs", "batteryLbs", "35")}
          {field("Breakage lbs", "breakageLbs", "150")}
          {field("Pickup Fee", "pickupFee", "50")}
          {field("Car Price", "carPrice", "300")}
        </div>

        <Divider
          style={{
            borderColor: "rgba(255,255,255,0.2)",
            margin: "16px 0 12px",
          }}
        />

        <div className="flex justify-between items-center mb-1">
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            Total Value:
          </span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
            ${totalValue.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            Pickup Fee:
          </span>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
            ${pickupFee.toLocaleString()}
          </span>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
            Final Offer
          </span>
          <p
            style={{ color: "#fff", fontWeight: 700, fontSize: 26, margin: 0 }}
          >
            ${finalOffer.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleSendOffer}
          disabled={isSending}
          style={{
            width: "100%",
            background: isSending ? "rgba(255,255,255,0.2)" : "#fff",
            color: isSending ? "rgba(255,255,255,0.6)" : "#6F3A92",
            border: "none",
            borderRadius: 10,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 600,
            cursor: isSending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity 0.2s",
          }}
        >
          {isSending ? (
            <Spin size="small" style={{ marginRight: 6 }} />
          ) : (
            <SendOutlined style={{ fontSize: 13 }} />
          )}
          {isSending ? "Sending offer…" : "Send Offer"}
        </button>
      </div>
    </>
  );
}

function AvailableEmployees({ orderId, onAssigned }) {
  const [api, contextHolder] = notification.useNotification();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: empResponse, isLoading: empLoading } =
    useGetAvailableEmployeesQuery({
      page,
      limit,
      // workingStatus: "available",
    });

  const [assignEmployee, { isLoading: isAssigning }] =
    useAssignEmployeeMutation();

  const employees = empResponse?.data ?? [];

  const totalEmployees =
    empResponse?.meta?.total || empResponse?.pagination?.total || 0;

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.phoneNumber ?? "").includes(search),
  );

  const handleAssign = async () => {
    if (!selectedId) return;
    try {
      await assignEmployee({ employee: selectedId, order: orderId }).unwrap();
      api.success({
        message: "Employee assigned!",
        description:
          "The employee has been successfully assigned to this order.",
        placement: "topRight",
        duration: 3,
      });
      setTimeout(() => onAssigned(), 1500);
    } catch (err) {
      api.error({
        message: "Assignment failed",
        description:
          err?.data?.message ?? "Something went wrong. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  return (
    <div className="flex-1">
      {contextHolder}
      <Card
        className="rounded-xl"
        styles={{ body: { padding: "20px 24px" } }}
        style={{ border: "1px solid #e5e7eb", background: "#fff" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <TeamOutlined style={{ color: "#7c3aed", fontSize: 16 }} />
          <span className="font-semibold text-gray-800 text-base">
            Available Employees
          </span>
        </div>

        {/* Search */}
        <Input
          prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            marginBottom: 16,
            fontSize: 13,
          }}
        />

        {/* Employee list */}
        {empLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No employees found
          </div>
        ) : (
          <div
            className="flex flex-col gap-3"
            style={{ maxHeight: 380, overflowY: "auto" }}
          >
            {filtered.map((emp) => {
              const isSelected = selectedId === emp._id;
              const isBusy = emp.isBusy;

              return (
                <div
                  key={emp._id}
                  onClick={() => !isBusy && setSelectedId(emp._id)}
                  style={{
                    border: isSelected
                      ? "2px solid #7c3aed"
                      : "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: isBusy ? "not-allowed" : "pointer",
                    background: isSelected ? "#faf5ff" : "#fff",
                    opacity: isBusy ? 0.65 : 1,
                    transition: "all 0.15s",
                    position: "relative",
                  }}
                >
                  {/* Top row: avatar + name + status + radio */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={40}
                        style={{
                          background: "#e9d5ff",
                          color: "#7c3aed",
                          fontWeight: 600,
                        }}
                      >
                        {emp.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <Text className="text-sm font-semibold text-gray-800">
                            {emp.name}
                          </Text>
                          <Tag
                            style={{
                              fontSize: 10,
                              padding: "0 7px",
                              borderRadius: 20,
                              border: "none",
                              background: isBusy ? "#fff7e6" : "#f0fdf4",
                              color: isBusy ? "#d97706" : "#16a34a",
                              fontWeight: 600,
                            }}
                          >
                            {isBusy ? "Busy" : "available"}
                          </Tag>
                        </div>
                        <Text className="text-xs text-gray-400">
                          {emp.phoneNumber}
                        </Text>
                      </div>
                    </div>

                    {/* Radio circle */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: isSelected ? "none" : "2px solid #d1d5db",
                        background: isSelected ? "#7c3aed" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <CheckOutlined
                          style={{ color: "#fff", fontSize: 10 }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Bottom row: jobs + address */}
                  <div className="flex items-center justify-between">
                    <Text className="text-xs text-gray-400">
                      {emp.completedJob} pickups
                    </Text>
                    {emp.address && (
                      <div className="flex items-center gap-1">
                        <EnvironmentFilled
                          style={{ color: "#9ca3af", fontSize: 11 }}
                        />
                        <Text className="text-xs text-gray-400">
                          {emp.address}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {totalEmployees > limit && (
          <div className="flex justify-center mt-5">
            <Pagination
              current={page}
              pageSize={limit}
              total={totalEmployees}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        )}

        {/* Assign button */}
        <button
          onClick={handleAssign}
          disabled={!selectedId || isAssigning}
          style={{
            width: "100%",
            marginTop: 20,
            background:
              !selectedId || isAssigning
                ? "#d1d5db"
                : "linear-gradient(135deg, #6F3A92 0%, #9F6AD4 100%)",
            color: !selectedId || isAssigning ? "#9ca3af" : "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            fontSize: 14,
            fontWeight: 600,
            cursor: !selectedId || isAssigning ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
          }}
        >
          {isAssigning ? (
            <Spin size="small" style={{ marginRight: 6 }} />
          ) : (
            <CheckOutlined style={{ fontSize: 13 }} />
          )}
          {isAssigning ? "Assigning…" : "Assign Employee"}
        </button>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewQuotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from");
  console.log("frommmmmm: ", from);

  const { data: response, isLoading, isError } = useGetOrderByIdQuery(id);
  const d = response?.data;

  const deliveryType = d?.deliveryType || "";
  const status = d?.status || "";
  const orderType = d?.orderType || "";

  console.log("deliveryType: ", deliveryType);
  console.log("status: ", status);
  console.log("orderType: ", orderType);

  // Pickup + Pending + Vehicle → Pricing Calculator
  const showPricingCalculator =
    // deliveryType === "pickup" &&
    status === "pending" && orderType === "Vehicle";

  const ShowAcceptOfferView = status === "pending" && orderType === "Metals";

  // Pickup + Accepted + Vehicle → Assign Employee
  const showAssignEmployee =
    // deliveryType === "pickup" &&
    status === "accepted" && orderType === "Vehicle";

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }
  if (isLoading) {
    return (
      <div className="bg-gray-50 px-4 py-6 md:px-8 rounded-lg">
        <Skeleton.Input
          active
          size="small"
          style={{ width: 150, marginBottom: 20 }}
        />

        <Skeleton active title={{ width: 250 }} paragraph={{ rows: 1 }} />

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* Left side */}
          <div className="flex-1">
            <Card className="mb-4">
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>

            <Card className="mb-4">
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>

            <Card>
              <Skeleton.Image active style={{ width: "100%", height: 220 }} />
            </Card>
          </div>

          {/* Right side */}
          <div className="md:w-80">
            <Card className="mb-4">
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>

            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </div>
        </div>
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
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-5">
        <Title level={4} className="!mb-1 !text-gray-900">
          {showAssignEmployee ? "Assign Employee" : "Review quote request"}
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
        <div
          className={`${
            showAssignEmployee ? "md:w-[600px]" : "md:w-100"
          } shrink-0`}
        >
          {from === "request" && showPricingCalculator ? (
            <PricingCalculator
              d={d}
              orderId={id}
              onOfferSent={() => navigate(-1)}
            />
          ) : from === "request" && showAssignEmployee ? (
            <AvailableEmployees orderId={id} onAssigned={() => navigate(-1)} />
          ) : from === "request" && ShowAcceptOfferView ? (
            <OfferAcceptSendOffer
              d={d}
              orderId={id}
              onOfferSent={() => navigate(-1)}
            />
          ) : (
            <OfferSummary d={d} />
          )}
          <DatesCard d={d} />
        </div>
      </div>
    </div>
  );
}
