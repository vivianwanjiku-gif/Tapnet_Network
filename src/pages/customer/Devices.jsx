import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import Icon from "../../components/Icon";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  useEffect(() => { api.get("/customer/devices").then((response) => setDevices(response.data)); }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Connected devices" lede="Phones and computers that last joined this line." />
      {devices.length === 0 && <p className="text-sm text-ink-soft">No devices yet.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => (
          <article key={device.id} className="card">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-signal-50 text-signal-700">
                <Icon name="device" />
              </span>
              <div>
                <h2 className="font-medium">{device.device_name}</h2>
                <p className="font-mono text-xs text-ink-faint">{device.mac_address}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-soft">Last connected {new Date(device.last_connected).toLocaleString("en-KE")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
