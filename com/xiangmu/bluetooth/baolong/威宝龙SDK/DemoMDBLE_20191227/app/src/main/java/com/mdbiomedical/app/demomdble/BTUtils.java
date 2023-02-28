package com.mdbiomedical.app.demomdble;

import android.bluetooth.BluetoothGattCharacteristic;
import android.os.Environment;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class BTUtils {
    public static final int TYPE_ECG = 0x26;
    public static final int TYPE_BP = 0x27;
    private static final byte BT_HEADER = 1;
    private static final byte BT_STANDBY = 2;
    private static final byte BT_MEASURE = 3;

    private static final byte BT_DOWNLOAD = 4;
    private static final byte BT_DOWNLOAD_WAIT = 0;
    private static final byte BT_DOWNLOAD_HEADER = 2;
    private static final byte BT_DOWNLOAD_RAWD = 3;

    private static final byte BT_DOWNLOAD_U1_COUNT = 5;
    private static final byte BT_DOWNLOAD_U2_COUNT = 6;

    private static final byte BT_SETUP = 5;
    private static final byte BT_SETUP_700X = 2;

    private static final byte BT_ERASE_FLASH = 6;
    private static final byte BT_ERASE_USER1 = 3;
    private static final byte BT_ERASE_USER2 = 4;

    private static final byte BT_CONFIG_INFO = 7;
    private static final byte BT_CONFIG_INFO_DEVICE = 1;
    private static final byte BT_CONFIG_INFO_SETTING = 2;

    private static final int CH_HR = 70;
    private static final int CH_MMHG = 71;
    private static final int CH_ECG = 73;
    private static final int CH_AUTOSCALE = 74;

    private static byte[] data = new byte[20];
    private static byte[] data2 = new byte[20];
    private static final int STATE_CONNECTED = 2;
    private static BluetoothLeService mBluetoothLeService;
    private static BluetoothGattCharacteristic characteristic1;
    private static BluetoothGattCharacteristic characteristic2;
    private static byte UserMode;
    private static int headerSeq = 0;
    private static int downloadBufSeq;
    private static int currentSize = 0;
    private static int totalSize = 12 * 256 + 68 * 125;
    private static byte[] FlashBuffer = new byte[256];
    private static byte[] rawDataBuf = new byte[13 * 256 + 68 * 125];
    static int seq = 0;
    static int m_seq = 0;
    static int m_tmpseq = 0;
    static int ecgSize = 1;

    public static void setBluetoothLeService(BluetoothLeService mBLE)
    {
        mBluetoothLeService = mBLE;
        Log.i("MD", "setBLEService");
    }
    public static void setCharacteristics(BluetoothGattCharacteristic c1, BluetoothGattCharacteristic c2) {
        characteristic1 = c1;
        characteristic2 = c2;
        Log.i("MD", "setCharacteristics");
    }
    public static void resend() {
        if (characteristic2 != null)
            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
    }
    public static void standby() {
        data[1] = BT_STANDBY;
        if (characteristic2 != null)
            mBluetoothLeService.writeCharacteristic(characteristic2, data);
    }

    public static void setBtDownloadWait() {
        if(data[1] == BT_DOWNLOAD && data[2] == BT_DOWNLOAD_RAWD) {
            data2[1] = BT_DOWNLOAD;
            data2[2] = BT_DOWNLOAD_WAIT;
            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
        }
    }

    public static void get_info() {
        data[1] = BT_CONFIG_INFO;
        data[2] = BT_CONFIG_INFO_DEVICE;
        if (characteristic2 != null)
            mBluetoothLeService.writeCharacteristic(characteristic2, data);
    }
    public static void download_user(int u) {
        if (u == 1) {
            data2[1] = BT_DOWNLOAD;
            data2[2] = BT_DOWNLOAD_U1_COUNT;
            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
        }
        else if (u == 2) {
            data2[1] = BT_DOWNLOAD;
            data2[2] = BT_DOWNLOAD_U2_COUNT;
            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
        }
    }

    public static void time_setting() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        String yyyy = sdf.format(new java.util.Date());
        sdf = new SimpleDateFormat("MM");
        String m = sdf.format(new java.util.Date());
        sdf = new SimpleDateFormat("dd");
        String d = sdf.format(new java.util.Date());
        sdf = new SimpleDateFormat("HH");
        String hh = sdf.format(new java.util.Date());
        sdf = new SimpleDateFormat("mm");
        String mm = sdf.format(new java.util.Date());
        sdf = new SimpleDateFormat("ss");
        String ss = sdf.format(new java.util.Date());

        data[1] = BT_SETUP;
        data[2] = BT_SETUP_700X;
        data[3] = (byte) (Integer.parseInt(yyyy) - 2000);
        data[4] = (byte) Integer.parseInt(m);
        data[5] = (byte) Integer.parseInt(d);
        data[6] = (byte) Integer.parseInt(hh);
        data[7] = (byte) Integer.parseInt(mm);
        data[8] = (byte) Integer.parseInt(ss);

        if (characteristic2 != null)
            mBluetoothLeService.writeCharacteristic(characteristic2, data);
    }

    public static void delete_user(int u) {
        if (u == 1) {
            Log.i("MD", "delete_user1");
            data[1] = BT_ERASE_FLASH;
            data[2] = BT_ERASE_USER1;
            if (characteristic2 != null) {
                mBluetoothLeService.writeCharacteristic(characteristic2, data);
            }
        }
        else if (u == 2) {
            Log.i("MD", "delete_user2");
            data[1] = BT_ERASE_FLASH;
            data[2] = BT_ERASE_USER2;
            if (characteristic2 != null) {
                mBluetoothLeService.writeCharacteristic(characteristic2, data);
            }
        }
    }

    public static void download_file(RecordList header) {
        currentSize = 0;
        UserMode = (byte) header.UserMode;
        headerSeq = (byte) header.Seq;
        downloadBufSeq = 1;

        data2[1] = BT_DOWNLOAD;
        data2[2] = BT_DOWNLOAD_RAWD;
        data2[3] = UserMode;
        data2[4] = (byte) headerSeq;
        data2[5] = (byte) downloadBufSeq;
        mBluetoothLeService.writeCharacteristic(characteristic2, data2);
        Log.d("MD", "download: header.Seq=" + headerSeq + ", downloadBufSeq=" + downloadBufSeq + ", currentSize=" + currentSize + ",header.UserMode=" + UserMode);
    }

    static void saveFile(RecordList header) {

        short[] rawData = new short[(12 * 256 + 68 * 125) / 2];
        int ecgCount = 34*125;
        short iFirstByte, iSecondByte;

        String Header_data = "";

        Header_data += header.sDatetime + " ";
        Header_data += header.Seq + " ";
        Header_data += header.Noise + " ";
        Header_data += header.UserMode + " ";
        Header_data += header.HeartRate + " ";
        Header_data += header.Pause + " ";
        Header_data += header.Rhythm + " ";
        Header_data += header.Waveform + " ";
        Header_data += header.EntryPosition + " ";
        Header_data += header.TachycardiaValue + " ";
        Header_data += header.BradycardiaValue + " ";
        Header_data += header.BPMNoiseFlag + " ";
        Header_data += header.BPHeartRate + " ";
        Header_data += header.HighBloodPressure + " ";
        Header_data += header.LowBloodPressure + " ";
        Header_data += header.WHOIndicate + " ";
        Header_data += header.AnalysisType + " ";
        Header_data += header.sFilename + " ";
        Header_data += header.DeviceAddress + " ";
        writeToFile(Header_data, header.sFilename, "Header");

        if (header.AnalysisType == TYPE_ECG) {

            String r_data = "";
            for (int i = 0, j = 0; i < rawData.length; i++, j += 2) {
                iFirstByte = (short) (0x00FF & ((short) rawDataBuf[j]));
                iSecondByte = (short) (0x00FF & ((short) rawDataBuf[j + 1]));
                rawData[i] = (short) (iFirstByte << 8 | iSecondByte);
                r_data += rawData[i] + ",";
            }
            writeToFile(r_data, header.sFilename, "Rawdata");

//            String e_data = "";
//            for (int i = 0; i < ecgCount; i++) {
//                e_data += rawData[i + 12 * 256 / 2] + ",";
//            }
            //writeToFile(r_data, header.sFilename, "ECG");

//        string length > 2000
//        int max_str_length = 2001 - ("MD: RawData").length();
//        while (r_data.length() > max_str_length) {
//            Log.i("MD", "RawData: " + r_data.substring(0, max_str_length));
//            r_data = r_data.substring(max_str_length);
//        }
//        Log.i("MD", "RawData: " + r_data);
        }
    }

    public static DataList functionBLE(final int[] value) {
        int ChannelNo, ChannelMSB, ChannelData, HeartRate, bpDiastolic, MDRawData;
        int format, bpCmd = 0;

        DataList res = new DataList();

        m_seq = value[0];
        if (m_seq - m_tmpseq != 1 && m_tmpseq - m_seq != 255) {
            res.lost = 1;
            Log.e("MD", "lost_package m_seq=" + Integer.toString(m_seq) + ", m_tmpseq=" + Integer.toString(m_tmpseq));
        }
        else
            res.lost = 0;
        m_tmpseq = m_seq;

        format = value[1];
        res.rformat = format;
        if (value.length > 2) {
            bpCmd = value[2];
            res.rbpCmd = bpCmd;
        }
        String tempLog = "";
        for (int x = 0; x < value.length; x++)
            tempLog = tempLog + value[x] + ",";
        Log.d("MD", "tempLog=" + tempLog);

        if (format == BT_MEASURE) {

            res.measured = new int[8];
            int j = 0;
            for (int i = 4; i < 20; ) {
                ChannelNo = value[i++] & 0xff;
                ChannelMSB = value[i++] & 0xff;
                ChannelData = (value[i++] & 0xff) * 256;
                ChannelData = ChannelData + (value[i++] & 0xff);
                res.measured[j++] = (ChannelNo);
                if (ChannelNo == CH_HR) {//HR
                    HeartRate = ChannelMSB * 256 * 256 + ChannelData;
                    res.measured[j++] = (HeartRate);
                }
                else if (ChannelNo == CH_MMHG) {//BP
                    bpDiastolic = ChannelMSB * 256 * 256 + ChannelData;
                    res.measured[j++] = (bpDiastolic);
                }
                else if (ChannelNo == CH_AUTOSCALE) {
                    ecgSize = ChannelMSB * 256 * 256 + ChannelData;
                    res.measured[j++] = (ecgSize);
                    Log.i("MD", "ecgSize = " + ecgSize);
                }
                else if (ChannelNo == CH_ECG) { //ecg data
                    MDRawData = ChannelMSB * 256 * 256 + ChannelData;
                    res.measured[j++] = (MDRawData);
                    if (HomeView.ecgCount < HomeView.ecg_rawData.length) {
                        HomeView.ecg_rawData[HomeView.ecgCount] = (short) (MDRawData);
                        HomeView.ecgCount++;
                        if (HomeView.ecgCount > 125 * 3) {
                            HomeView.displayData[HomeView.displayCount] = HomeView.ecg_rawData[HomeView.ecgCount - 1];
                            HomeView.displayCount++;
                        }
                    }
                }

            }
        }
        else if (format == BT_HEADER) {
            if (bpCmd < 5 && HomeView.Measure_Header) {
                for (int i = 0; i < 16; i++)
                    FlashBuffer[i] = (byte) value[i + 4];

                String datetime = String.format("%02d%02d%02d%02d%02d%02d", FlashBuffer[1], FlashBuffer[2], FlashBuffer[3], FlashBuffer[4], FlashBuffer[5], FlashBuffer[6]);
                RecordList rec = new RecordList();
                res.record = new RecordList();

                rec.sDatetime = datetime;

                int n = 0;
                if ((FlashBuffer[15] & 0x02) == 0x02)
                    n = 1;
                rec.Noise = n;
                rec.UserMode = FlashBuffer[7];

                if (FlashBuffer[10] != 0 && FlashBuffer[12] != 0)
                    rec.AnalysisType = TYPE_BP;
                else
                    rec.AnalysisType = TYPE_ECG;

                if ((FlashBuffer[15] & 0x80) == 0x80)//AF
                    rec.BPMNoiseFlag = 1;
                else
                    rec.BPMNoiseFlag = 0;

                if (rec.AnalysisType == TYPE_BP) {
                    rec.HighBloodPressure = (FlashBuffer[10] + FlashBuffer[11] * 256);
                    rec.LowBloodPressure = (FlashBuffer[12] + FlashBuffer[13] * 256);
                    rec.WHOIndicate = (FlashBuffer[14]);
                    rec.BPHeartRate = (FlashBuffer[9] & 0xFF);
                } else {
                    if (n == 0) {
                        rec.BPHeartRate = (FlashBuffer[9] & 0xFF);
                        if ((FlashBuffer[15] & 0x10) == 0x10)
                            rec.Pause = (1);
                        else
                            rec.Pause = (0);

                        if ((FlashBuffer[15] & 0x04) == 0x04)
                            rec.Rhythm = (1);
                        else
                            rec.Rhythm = (0);

                        if ((FlashBuffer[15] & 0x08) == 0x08)
                            rec.Waveform = (1);
                        else
                            rec.Waveform = (0);
                    }
                }
                res.record = rec;
            }
        }
        else if (format == BT_CONFIG_INFO) {
            if (bpCmd == BT_CONFIG_INFO_DEVICE) {
                res.vDeviceID = (value[12] * 256 * 256 * 256 + value[13] * 256 * 256 + value[14] * 256 + value[15]);
                if (HomeView.state == STATE_CONNECTED) {
                    data[1] = BT_CONFIG_INFO;
                    data[2] = BT_CONFIG_INFO_SETTING;
                    if (characteristic2 != null) {
                        mBluetoothLeService.writeCharacteristic(characteristic2, data);
                    }
                }
            }
            else if (bpCmd == BT_CONFIG_INFO_SETTING) {
                short vFirmwareVersion = (short) (value[3] * 256 + value[4]);
                String v1, v2, v3, ver;
                ver = String.format("%d", vFirmwareVersion);
                if (ver.length() >= 5) {
                    v3 = ver.substring(ver.length() - 2);
                    ver = ver.substring(0, ver.length() - 2);
                    v2 = ver.substring(ver.length() - 2);
                    ver = ver.substring(0, ver.length() - 2);
                    v1 = ver.substring(ver.length() - 1);
                    res.FirmwareVersion = String.format("%s.%s.%s", v1, v2, v3);
                }
            }
        }
        else if (format == BT_DOWNLOAD) {
            int recordsCount1, recordsCount2;
            if (bpCmd == BT_DOWNLOAD_U1_COUNT) {
                recordsCount1 = value[3];
                recordsCount2 = 0;
                headerSeq = 0;
                HomeView.totalCount = (recordsCount1 + recordsCount2);
                if (HomeView.totalCount > 0) {
                    if (HomeView.state == STATE_CONNECTED) {
                        data2[1] = BT_DOWNLOAD;
                        data2[2] = BT_DOWNLOAD_HEADER;
                        data2[3] = (byte) headerSeq;
                        if (characteristic2 != null) {
                            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                            Log.i("MD","download_U1_count");
                        }
                    }
                }
            }
            else if (bpCmd == BT_DOWNLOAD_U2_COUNT) {
                recordsCount1 = 0;
                recordsCount2 = value[4];
                headerSeq = 0;
                HomeView.totalCount = (recordsCount1 + recordsCount2);
                if (HomeView.totalCount > 0) {
                    if (HomeView.state == STATE_CONNECTED) {
                        data2[1] = BT_DOWNLOAD;
                        data2[2] = BT_DOWNLOAD_HEADER;
                        data2[3] = (byte) headerSeq;
                        if (characteristic2 != null) {
                            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                            Log.i("MD","download_U2_count");
                        }
                    }
                }
            }
            else if (bpCmd == BT_DOWNLOAD_HEADER) {
                Log.i("MD", "get header");
                if (HomeView.downloadCount < HomeView.totalCount) {
                    int[] d_header = new int[16];
                    String h = "";
                    for (int i = 0; i < 16; i++) {
                        d_header[i] = value[i + 4];
                        h += String.valueOf(value[i + 4]);
                    }
                    if (res.lost == 1) {
                        data2[1] = BT_DOWNLOAD;
                        data2[2] = BT_DOWNLOAD_HEADER;
                        data2[3] = (byte) headerSeq;
                        if (characteristic2 != null) {
                            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                        }
                        return res;
                    }
                    RecordList rec = new RecordList();
                    res.record = new RecordList();
                    String datetime = String.format("%02d%02d%02d%02d%02d%02d", d_header[1], d_header[2], d_header[3], d_header[4], d_header[5], d_header[6]);

                    rec.sDatetime = datetime;
                    rec.Seq = d_header[0];

                    int n = 0;
                    if ((d_header[15] & 0x02) == 0x02)
                        n = 1;
                    rec.Noise = n;
                    rec.UserMode = d_header[7];
                    rec.HeartRate = d_header[9];
                    if ((d_header[15] & 0x10) == 0x10)
                        rec.Pause = 1;
                    else
                        rec.Pause = 0;

                    if ((d_header[15] & 0x04) == 0x04)
                        rec.Rhythm = 1;
                    else
                        rec.Rhythm = 0;

                    if ((d_header[15] & 0x08) == 0x08)
                        rec.Waveform = 1;
                    else
                        rec.Waveform = 0;

                    if ((d_header[15] & 0x20) == 0x20)//fast
                        rec.TachycardiaValue = 1;
                    else
                        rec.TachycardiaValue = 0;

                    if ((d_header[15] & 0x40) == 0x40)//slow
                        rec.BradycardiaValue = 1;
                    else
                        rec.BradycardiaValue = 0;

                    if ((d_header[15] & 0x80) == 0x80)//AF
                        rec.BPMNoiseFlag = 1;
                    else
                        rec.BPMNoiseFlag = 0;

                    rec.EntryPosition = d_header[8];

                    rec.BPHeartRate = d_header[9];

                    rec.HighBloodPressure = d_header[10] + d_header[11] * 256;

                    rec.LowBloodPressure = d_header[12] + d_header[13] * 256;
                    rec.WHOIndicate = d_header[14];

                    if (rec.HighBloodPressure == 0 && rec.LowBloodPressure == 0)//ECG
                        rec.AnalysisType = TYPE_ECG;
                    else
                        rec.AnalysisType = TYPE_BP;

                    rec.DeviceAddress = HomeView.mDeviceAddress;
                    rec.sFilename = rec.DeviceAddress.replaceAll(":","") + "_" + rec.sDatetime;
                    //rec.sFilename = datetime + ".dat";

                    res.record = rec;
                    byte h2[] = new byte[16];
                    for (int j = 0; j < 16; j++)
                        h2[j] = (byte) d_header[j];
                    //res.header = h2;

                    if ((HomeView.downloadCount < HomeView.totalCount)) {
                        headerSeq++;//get next header
                        data2[1] = BT_DOWNLOAD;
                        data2[2] = BT_DOWNLOAD_HEADER;
                        data2[3] = (byte) headerSeq;
                        if (characteristic2 != null) {
                            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                        }
                    }
                }
//                else
//                {
//                    data2[1] = BT_DOWNLOAD;
//                    data2[2] = BT_DOWNLOAD_WAIT;
//                    mBluetoothLeService.writeCharacteristic(characteristic2, data2);
//                    Log.i("MD", "waiting...");
//                }
            }
            else if (bpCmd == BT_DOWNLOAD_RAWD) {
                Log.i("MD", "get raw data");
                res.finished = 0;
                int Cmd = value[3];
                if (Cmd < 15) {
                    Log.d("MD", "cmd<15");
                    for (int i = 0; i < 16; i++)
                        FlashBuffer[Cmd * 16 + i] = (byte) value[i + 4];
                } else if (Cmd == 15) {
                    Log.d("MD", "cmd=15");
                    Log.e("MD", "header.Seq=" + headerSeq + ", downloadBufSeq=" + downloadBufSeq + ", currentSize=" + currentSize);
                    if (res.lost == 1) {
                        data2[1] = BT_DOWNLOAD;
                        data2[2] = BT_DOWNLOAD_RAWD;
                        data2[3] = (byte) UserMode;
                        data2[4] = (byte) headerSeq;
                        data2[5] = (byte) downloadBufSeq;
                        if (characteristic2 != null) {
                            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                        }
                        Log.e("MD", "lost------header.Seq=" + headerSeq + ", downloadBufSeq=" + downloadBufSeq + ", currentSize=" + currentSize);
                        return res;
                    }
                    else {

                        for (int i = 0; i < 16; i++)
                            FlashBuffer[Cmd * 16 + i] = (byte) value[i + 4];

                        if (currentSize < 12 * 256 + 68 * 125) {
                            for (int i = 0; i < 256; i++) {
                                rawDataBuf[currentSize++] = FlashBuffer[i];
                            }
                        }

                        int percentage = (currentSize * 100 / totalSize);
                        if (percentage >= 100)
                            percentage = 100;

                        res.percent = percentage;

                        if (currentSize >= 12 * 256 + 68 * 125) {
                            res.rawData = rawDataBuf;
                            currentSize = 0;
                            res.finished = 1;
                            data2[1] = BT_DOWNLOAD;
                            data2[2] = BT_DOWNLOAD_WAIT;
                            mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                            //Log.d("MD", "save file:" + HomeView.checkedList.get(0).intValue());
                            //saveFile();
                        } else {
                            res.finished = 0;
                            data2[1] = BT_DOWNLOAD;
                            data2[2] = BT_DOWNLOAD_RAWD;
                            data2[3] = (byte) UserMode;
                            data2[4] = (byte) headerSeq;
                            data2[5] = (byte) ++downloadBufSeq;

                            if (characteristic2 != null) {
                                mBluetoothLeService.writeCharacteristic(characteristic2, data2);
                            }
                            Log.d("MD", "download: header.Seq=" + headerSeq + ", downloadBufSeq=" + downloadBufSeq + ", currentSize=" + currentSize);
                        }
                    }
                }
            }
        }
        return res;
    }

    public static void writeToFile(String data, String filename, String type) {
        String path = Environment.getExternalStorageDirectory().getPath();
        try {
            File file = new File( path+ "/MDBLE/", type);
            if (!file.exists()) {
                file.mkdirs();
            }
            File file2 = new File(file, filename + ".txt");
            FileOutputStream fout = new FileOutputStream(file2);
            if (!file2.exists()) {
                file2.createNewFile();
            }
            fout.write(data.getBytes());
            fout.close();

            Log.d("MD", "Write to STORAGE!");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static List<RecordList> readFiles() {
        String path = Environment.getExternalStorageDirectory().getPath();
        String data_header;
        List<RecordList> newRecordList = new ArrayList<RecordList>();
        RecordList header = new RecordList();

        try {
            File file = new File( path+ "/MDBLE/Header/");
            if (!file.exists()) {
                return newRecordList;
            }
            File[] fileList = file.listFiles();
            CharSequence[] list =new CharSequence[fileList.length];
            for(int i=0; i < list.length; i++){
                list[i]=fileList[i].getName();
                data_header = readFromFile(fileList[i]);
                header = StringToHeader(data_header);
                if (header.DeviceAddress != null && header.DeviceAddress.length() > 0)
                    newRecordList.add(header);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return newRecordList;
    }

    public static boolean deleteFile(String filename, int type) {
        String path = Environment.getExternalStorageDirectory().getPath();
        boolean bool = false;

        try {
            File file = new File( path+ "/MDBLE/Header/");

            File file2 = new File(file, filename + ".txt");
            if (!file.exists() || !file2.exists())
                return false;

            bool = file2.delete();

            if (type == TYPE_ECG) {
//                file = new File(path + "/MDBLE/ECG/");
//                file2 = new File(file, filename + ".txt");
//                file2.delete();
                file = new File(path + "/MDBLE/Rawdata/");
                file2 = new File(file, filename + ".txt");
                file2.delete();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return bool;
    }

    public static short[] readecg(String filename) {
        String path = Environment.getExternalStorageDirectory().getPath();
        String ecg_string;
        String a = "";
        short[] ecg_array = new short[125 * 34];
        try {
            File file = new File( path+ "/MDBLE/Rawdata/");
            if (!file.exists()) {
                return ecg_array;
            }
            File file2 = new File( path+ "/MDBLE/Rawdata/", filename);
            ecg_string = readFromFile(file2);
            String[] words = ecg_string.split(",");
            for (int i = 0; i < 125 * 34; i++) {
                ecg_array[i] = Short.parseShort(words[i]);
                //a+=ecg_array[i]+" ";
            }
            //Log.d("MD", "ecg_array: "+words.length + " data: "+ a);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return ecg_array;
    }
    private static String readFromFile(File fin) {
        StringBuilder data = new StringBuilder();
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(fin), "utf-8"));
            String line;
            while ((line = reader.readLine()) != null) {
                data.append(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                reader.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return data.toString();
    }

    private static RecordList StringToHeader(String s) {
        RecordList rec = new RecordList();
        String[] words = s.split(" ");
        if (words.length > 18) {
            rec.sDatetime = words[0];
            rec.Seq = Integer.parseInt(words[1]);
            rec.Noise = Integer.parseInt(words[2]);
            rec.UserMode = Integer.parseInt(words[3]);
            rec.HeartRate = Integer.parseInt(words[4]);
            rec.Pause = Integer.parseInt(words[5]);
            rec.Rhythm = Integer.parseInt(words[6]);
            rec.Waveform = Integer.parseInt(words[7]);
            rec.EntryPosition = Integer.parseInt(words[8]);
            rec.TachycardiaValue = Integer.parseInt(words[9]);
            rec.BradycardiaValue = Integer.parseInt(words[10]);
            rec.BPMNoiseFlag = Integer.parseInt(words[11]);
            rec.BPHeartRate = Integer.parseInt(words[12]);
            rec.HighBloodPressure = Integer.parseInt(words[13]);
            rec.LowBloodPressure = Integer.parseInt(words[14]);
            rec.WHOIndicate = Integer.parseInt(words[15]);
            rec.AnalysisType = Integer.parseInt(words[16]);
            rec.sFilename = words[17];
            rec.DeviceAddress = words[18];
        }
        return rec;
    }
}