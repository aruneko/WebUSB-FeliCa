import { RCS380, ReceivedPacket } from 'rc_s380_driver'

export class TypeFTag {
  private protocol = Uint8Array.of(0x00, 0x18)
  private rf = Uint8Array.of(0x01, 0x01, 0x0f, 0x01)

  constructor(readonly rcs380: RCS380) {}

  public static async connect(): Promise<TypeFTag> {
    const device = await RCS380.connect()
    return new TypeFTag(device)
  }

  private async sendSenseTypeFCommand(): Promise<ReceivedPacket> {
    // Type-F判別コマンド
    const command = Uint8Array.of(0x00, 0xff, 0xff, 0x01, 0x00)
    // コマンドの先頭に`コマンド長+1`を数値で指定する必要があるらしい
    const payload = Uint8Array.of(command.byteLength + 1, ...command)
    // Type-F判別コマンドの送信
    return this.rcs380.inCommRf(payload, 0.01)
  }

  private async findTypeFTag(): Promise<Uint8Array> {
    console.info('Find Type-F tag')
    let data = new Uint8Array(0)
    // IDmが取得できるまで無限ループ
    while (true) {
      // IDm/PMm取得コマンドの発行
      await this.rcs380.sendPreparationCommands(this.rf, this.protocol)
      const result = await this.sendSenseTypeFCommand()
      // パケットの本体部分だけ取っておく
      data = result.data
      if (result.payload.byteLength === 37) {
        // IDmが取得できた場合ループから抜ける
        break
      }
    }
    return data
  }

  public async findIDm(): Promise<Uint8Array> {
    await this.rcs380.initDevice()
    const result = await this.findTypeFTag()
    await this.rcs380.disconnect()
    // IDm相当部分だけを切って返す
    return result.slice(9, 17)
  }
}