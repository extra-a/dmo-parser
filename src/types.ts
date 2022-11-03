
export interface DemoHeader {
  fileVersion: number,
  protocolVersion: number,
}

export interface Packet {
  timestamp: number,
  ch: number,
}

export interface DemoData {
  header: DemoHeader,
  events: Packet[],
}
