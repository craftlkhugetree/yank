package com.mdbiomedical.app.demomdble;

import android.app.Activity;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.os.IBinder;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.SimpleExpandableListAdapter;
import android.widget.TextView;
import android.widget.Toast;
import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.common.api.GoogleApiClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class HomeView extends Activity {

    public static final byte BT_HEADER = 1;
    public static final byte BT_MEASURE = 3;
    public static final byte BT_DOWNLOAD = 4;
    public static final byte BT_DOWNLOAD_HEADER = 2;
    public static final byte BT_DOWNLOAD_RAWD = 3;
    public static final byte BT_DOWNLOAD_U1_COUNT = 5;
    public static final byte BT_DOWNLOAD_U2_COUNT = 6;
    public static final byte BT_SETUP = 5;
    public static final byte BT_ERASE_FLASH = 6;
    public static final byte BT_CONFIG_INFO = 7;
    public static final byte BT_CONFIG_INFO_DEVICE = 1;
    public static final byte BT_CONFIG_INFO_SETTING = 2;

    public static final byte MEASURE_VIEW = 0;
    public static final byte DOWNLOAD_VIEW = 1;
    public static final byte RECORD_VIEW = 2;

    final int CH_HR = 70;
    final int CH_MMHG = 71;
    final int CH_ECG = 73;
    final int CH_AUTOSCALE = 74;

    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;

    final int TABLE_LIST_SIZE = 6;
    public static final String EXTRAS_DEVICE_NAME = "DEVICE_NAME";
    public static final String EXTRAS_DEVICE_ADDRESS = "DEVICE_ADDRESS";

    public static Context context;
    public static Button TimeSetting, delete_user1, delete_user2, connection_state, get_info, measure, download_user1, download_user2, start_download, read_records;
    public static TextView tv_current, tv_total, tv_mmhgtitle, tv_percent, tv_measure_hr, tv_measure_bp;
    public static ImageView button_view;
    public static LinearLayout ll_data_table, ECGView, content_bg_buttons;
    public static LinearLayout ECGdetail;
    public static ScrollView scroller_ecg, scroller_data;

    int downloadFileCnt;
    ProgressDialog procDialog;
    private List<RecordList> newRecordList = new ArrayList<RecordList>();
    private RecordList header = new RecordList();
    private RecordList rec_n = new RecordList();
    public static ArrayList<Integer> checkedList = new ArrayList<Integer>();
    public static String mDeviceName;
    public static String mDeviceAddress;
    private final static String TAG = BluetoothLeService.class.getSimpleName();
    public BluetoothLeService mBluetoothLeService;
    private ArrayList<ArrayList<BluetoothGattCharacteristic>> mGattCharacteristics = new ArrayList<ArrayList<BluetoothGattCharacteristic>>();
    private final String LIST_NAME = "NAME";
    private final String LIST_UUID = "UUID";
    private BluetoothGattCharacteristic characteristic1;
    public static BluetoothGattCharacteristic characteristic2;
    Timer timer = new Timer(true);
    public static byte view_status = 0;
    public static int state = -1;
    private int sec;
    private int dID;
    private char writeFlag;
    public static int lost = 0;
    public static int downloadCount;
    public static int totalCount;
    int c = 1;
    private int retryCmdCount;
    private BluetoothAdapter mBluetoothAdapter;
    public static int checkid = 0;
    int ChannelNo;
    int HeartRate;
    int bpDiastolic;

    public static int MDRawData;
    public static ECGImageView iv_ECG;
    public static int iECGWidth, iECGHeight;
    public static boolean bECGMode = false;
    public static short[] ecg_rawData = new short[125 * 34]; //128*34
    public static short[] displayData = new short[125 * 34]; //128*34

    public static int ecgCount = 0, displayCount = 0, ecgSize = 1, iDrawCnt = 0, checkecg = 0;
    public static boolean newMeasure = true;
    public static boolean Measure_Header = true;

    private final ServiceConnection mServiceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mBluetoothLeService = ((BluetoothLeService.LocalBinder) service).getService();
            if (!mBluetoothLeService.initialize()) {
                Log.e(TAG, "Unable to initialize Bluetooth");
                finish();
            }
            // Automatically connects to the device upon successful start-up initialization.
            mBluetoothLeService.connect(mDeviceAddress);
            BTUtils.setBluetoothLeService(mBluetoothLeService);
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mBluetoothLeService = null;
            BTUtils.setBluetoothLeService(mBluetoothLeService);
        }
    };
    /*
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //getSupportActionBar().hide();
        Log.d("MD", "onCreate");
        context = HomeView.this;
        final Intent intent = getIntent();
        mDeviceName = intent.getStringExtra(EXTRAS_DEVICE_NAME);
        mDeviceAddress = intent.getStringExtra(EXTRAS_DEVICE_ADDRESS);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        init();

        registerReceiver(mGattUpdateReceiver, makeGattUpdateIntentFilter());
        Intent gattServiceIntent = new Intent(this, BluetoothLeService.class);
        bindService(gattServiceIntent, mServiceConnection, BIND_AUTO_CREATE);
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();

        final BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mBluetoothLeService == null) {
            Timer single_timer = new Timer();
            single_timer.schedule(new TimerTask() {
                @Override
                public void run() {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        addEmptytable(TABLE_LIST_SIZE);
                    }
                });
                }
            }, 100);
        }
    }

    @Override
    protected void onPause() {
        // TODO Auto-generated method stub
        super.onPause();
        Log.d("MD", "on Pause");
    }

    @Override
    public void onBackPressed() {
        if (checkecg == 1) {
            if (view_status == MEASURE_VIEW) {
                scroller_ecg.setVisibility(View.INVISIBLE);
                ECGView.setVisibility(View.VISIBLE);
                content_bg_buttons.setVisibility(View.VISIBLE);
                button_view.setImageResource(R.mipmap.button_ecg);
                checkecg = 0;
            }
            else if (view_status == RECORD_VIEW) {
                scroller_ecg.setVisibility(View.INVISIBLE);
                scroller_data.setVisibility(View.VISIBLE);
                content_bg_buttons.setVisibility(View.VISIBLE);
                button_view.setImageResource(R.mipmap.icon_delete);
                checkecg = 0;
            }
        }
        else {
            BTUtils.standby();
            timer.cancel();
            setResult(RESULT_OK);
            finish();
        }
    }

    @Override
    public void onStart() {
        super.onStart();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client.connect();
        Action viewAction = Action.newAction(
                Action.TYPE_VIEW, // TODO: choose an action type.
                "HomeView Page", // TODO: Define a title for the content shown.
                // TODO: If you have web page content that matches this app activity's content,
                // make sure this auto-generated web page URL is correct.
                // Otherwise, set the URL to null.
                Uri.parse("http://host/path"),
                // TODO: Make sure this auto-generated app URL is correct.
                Uri.parse("android-app://com.mdbiomedical.app.demomdble/http/host/path")
        );
        AppIndex.AppIndexApi.start(client, viewAction);
    }

    @Override
    public void onStop() {
        super.onStop();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        Action viewAction = Action.newAction(
                Action.TYPE_VIEW, // TODO: choose an action type.
                "HomeView Page", // TODO: Define a title for the content shown.
                // TODO: If you have web page content that matches this app activity's content,
                // make sure this auto-generated web page URL is correct.
                // Otherwise, set the URL to null.
                Uri.parse("http://host/path"),
                // TODO: Make sure this auto-generated app URL is correct.
                Uri.parse("android-app://com.mdbiomedical.app.demomdble/http/host/path")
        );
        AppIndex.AppIndexApi.end(client, viewAction);
        client.disconnect();
        unbindService(mServiceConnection);
    }

    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
        timer.cancel();
        unregisterReceiver(mGattUpdateReceiver);
        Log.d("MD", "unregisterReceiver() on onDestroy");
        if (mBluetoothLeService != null) {
            try {
                mBluetoothLeService.disconnect();
                mBluetoothLeService.close();
                mBluetoothLeService = null;
                mBluetoothAdapter.cancelDiscovery();
                unbindService(mServiceConnection);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                Log.d("MD", "not binded or mBluetoothLeService error ");
            }
        }
        System.gc();
        finish();
    }

    private void init() {
        // initiate
        ll_data_table = (LinearLayout) findViewById(R.id.ll_data_table);
        content_bg_buttons = (LinearLayout) findViewById(R.id.content_bg_buttons);
        tv_current = (TextView) findViewById(R.id.tv_current);
        tv_total = (TextView) findViewById(R.id.tv_total);
        tv_mmhgtitle = (TextView) findViewById(R.id.tv_mmhgtitle);
        tv_percent = (TextView) findViewById(R.id.tv_percent);
        tv_measure_hr = (TextView) findViewById(R.id.tv_measure_hr);
        tv_measure_bp = (TextView) findViewById(R.id.tv_measure_bp);
        button_view = (ImageView) findViewById(R.id.button_view);
        ECGdetail = (LinearLayout) findViewById(R.id.ECGdetail);
        ECGView = (LinearLayout) findViewById(R.id.ECGView);
        iv_ECG = (ECGImageView) findViewById(R.id.ECGGraph);
        scroller_ecg = (ScrollView)findViewById( R.id.scroller_ecg );
        scroller_data = (ScrollView)findViewById( R.id.scroller_data );

        setView(view_status);
        button_view.setVisibility(View.INVISIBLE);
        //get iv_ECG width and height
        ViewTreeObserver vto1 = iv_ECG.getViewTreeObserver();
        vto1.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                iv_ECG.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                iECGWidth = iv_ECG.getWidth();
                iECGHeight = iv_ECG.getHeight();
            }
        });

        //measure button
        measure = (Button) findViewById(R.id.measure);
        measure.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "measure_onclick");
                if (state == STATE_CONNECTED) {
                    BTUtils.standby();
                    view_status = MEASURE_VIEW;
                    setView(view_status);
                    button_view.setVisibility(View.INVISIBLE);
                    checkedList.clear();
                }
            }
        });

        //information button
        get_info = (Button) findViewById(R.id.get_info);
        get_info.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "get_Version_onclick");
                if (state == STATE_CONNECTED)
                    BTUtils.get_info();
            }
        });

        //download u1 button
        download_user1 = (Button) findViewById(R.id.download_user1);
        download_user1.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "download_user1_onclick");
                if (state == STATE_CONNECTED) {
                    BTUtils.download_user(1);
                    view_status = DOWNLOAD_VIEW;
                    setView(view_status);
                    button_view.setVisibility(View.INVISIBLE);
                    tv_percent.setText("0");
                    tv_current.setText("0");
                    tv_total.setText("0");
                    newRecordList.clear();
                    checkedList.clear();
                    sec = 0;
                }
            }
        });

        //download u2 button
        download_user2 = (Button) findViewById(R.id.download_user2);
        download_user2.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "download_user2_onclick");
                if (state == STATE_CONNECTED) {
                    BTUtils.download_user(2);
                    view_status = DOWNLOAD_VIEW;
                    setView(view_status);
                    button_view.setVisibility(View.INVISIBLE);
                    tv_percent.setText("0");
                    tv_current.setText("0");
                    tv_total.setText("0");
                    newRecordList.clear();
                    checkedList.clear();
                    sec = 0;
                }
            }
        });

        //set time button
        TimeSetting = (Button) findViewById(R.id.time_setting);
        TimeSetting.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "set_time_onclick");
                if (state == STATE_CONNECTED)
                    BTUtils.time_setting();
            }
        });

        //delete u1 button
        delete_user1 = (Button) findViewById(R.id.delete_user1);
        delete_user1.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "delete_user1_onclick");
                if (state == STATE_CONNECTED)
                    BTUtils.delete_user(1);
            }
        });

        //delete u2 button
        delete_user2 = (Button) findViewById(R.id.delete_user2);
        delete_user2.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "delete_user2_onclick");
                if (state == STATE_CONNECTED)
                    BTUtils.delete_user(2);
            }
        });

        //connect / disconnect button
        connection_state = (Button) findViewById(R.id.connection_state);
        connection_state.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "connection_state, mDeviceAddress=" + mDeviceAddress + ",state=" + state);
                if (!mBluetoothAdapter.isEnabled() && state == 0) {
                    Log.e("MD", "openBLE_error133");
                    c = 0;
                    mBluetoothAdapter.enable();
                    // Checks if Bluetooth is supported on the device.
                    if (mBluetoothAdapter == null) {
                        Toast.makeText(getBaseContext(), "bluetooth_not_supported", Toast.LENGTH_SHORT).show();
                        finish();
                        return;
                    }
                }
                if (connection_state.getText() == "CONNECT") {
                    c++;
                    Toast.makeText(getBaseContext(), "c=" + c, Toast.LENGTH_SHORT).show();
                    //mBluetoothLeService.setReConnectAddress(mDeviceAddress);
                    mBluetoothLeService.connect(mDeviceAddress);
                } else {
                    mBluetoothLeService.disconnect();
                    retryCmdCount = 0;
                }
            }
        });

        // download data button
        start_download = (Button) findViewById(R.id.start_download);
        start_download.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                Log.i(TAG, "start download...");
                if (checkedList.size() == 0) {
                    Toast.makeText(getBaseContext(), "Please select files!", Toast.LENGTH_SHORT).show();
                }
                else if (view_status == RECORD_VIEW) {
                    Toast.makeText(getBaseContext(), "Please select which user data to be downloaded!", Toast.LENGTH_LONG).show();
                }
                else {
                    downloadFileCnt = checkedList.size();
                    procDialog = new ProgressDialog(context);
                    procDialog.setMessage("0% completed in file 1/" + downloadFileCnt);
                    procDialog.setCancelable(false);
                    procDialog.setButton(DialogInterface.BUTTON_NEGATIVE, "cancel", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.dismiss();
                            BTUtils.setBtDownloadWait();
                            writeFlag = 1;
                            sec = 0;
                            retryCmdCount = 0;
                            //currentSize = 0;

                            checkedList.clear();
                            uncheckAll();
                            Toast.makeText(getBaseContext(), "Download cancelled!", Toast.LENGTH_LONG).show();
                        }
                    });
                    procDialog.show();

                    Toast.makeText(getBaseContext(), "Start downloading raw data...", Toast.LENGTH_SHORT).show();
                    int iFirst = checkedList.get(0).intValue();
                    startDownloadAFile(iFirst);
                }
            }
        });

        // stop downloading
        read_records = (Button) findViewById(R.id.read_records);
        read_records.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View arg0) {
                BTUtils.setBtDownloadWait();
                Log.i(TAG, "Read downloaded records");
                view_status = RECORD_VIEW;
                setView(view_status);
                tv_percent.setText("0");
                checkedList.clear();
                newRecordList.clear();
                newRecordList = BTUtils.readFiles();
                ll_data_table.removeAllViews();
                tv_total.setText(String.valueOf(newRecordList.size()));
                if (newRecordList.size() == 0) {
                    tv_current.setText("0");
                    Toast.makeText(getBaseContext(), "No records", Toast.LENGTH_LONG).show();
                    button_view.setVisibility(View.INVISIBLE);
                }
                else {
                    ll_data_table.removeAllViews();
                    for (int i = 0; i < newRecordList.size(); i++) {
                        tv_current.setText(String.valueOf(i+1));
                        addRecordView(HomeView.context, i);
                    }
                    button_view.setVisibility(View.VISIBLE);
                    button_view.setImageResource(R.mipmap.icon_delete);
                }
            }
        });

        button_view.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                if (view_status == MEASURE_VIEW)
                {
                    if (checkecg == 0) {

                        iDrawCnt = 125 * 3 ;
                        content_bg_buttons.setVisibility(View.GONE);
                        ECGView.setVisibility(View.INVISIBLE);
                        scroller_ecg.scrollTo(0,0);
                        scroller_ecg.setVisibility(View.VISIBLE);
                        button_view.setImageResource(R.mipmap.icon_close);
                        ECGdetail.removeAllViews();

                        for(int i=0;i<6;i++)
                            addImageView(context);

                        checkecg = 1;
                    }
                    else {
                        scroller_ecg.setVisibility(View.INVISIBLE);
                        ECGView.setVisibility(View.VISIBLE);
                        content_bg_buttons.setVisibility(View.VISIBLE);
                        button_view.setImageResource(R.mipmap.button_ecg);
                        checkecg = 0;
                    }
                }
                else if (view_status == RECORD_VIEW)
                {
                    if (checkecg == 0) {
                        if (checkedList.size() <= 0 ) {
                            Toast.makeText(getBaseContext(), "Please select records!", Toast.LENGTH_LONG).show();
                        }
                        else {
                            int recordIndex;
                            while(checkedList.size()>0) {
                                recordIndex = checkedList.get(0).intValue();
                                if (recordIndex >= newRecordList.size())
                                    Toast.makeText(getBaseContext(), "Delete record failed!", Toast.LENGTH_SHORT).show();

                                header = newRecordList.get(recordIndex);
                                //        uncheckAll();
                                //        checkedList.clear();
                                boolean bool = BTUtils.deleteFile(header.sFilename, header.AnalysisType);
                                if(bool)
                                    Toast.makeText(getBaseContext(), "Delete record success!", Toast.LENGTH_SHORT).show();
                                else
                                    Toast.makeText(getBaseContext(), "Delete record failed!", Toast.LENGTH_SHORT).show();

                                checkedList.remove(0);
                            }

                            uncheckAll();
                            newRecordList.clear();
                            newRecordList = BTUtils.readFiles();
                            ll_data_table.removeAllViews();
                            tv_total.setText(String.valueOf(newRecordList.size()));
                            if (newRecordList.size() == 0) {
                                tv_current.setText("0");
                                Toast.makeText(getBaseContext(), "No records", Toast.LENGTH_LONG).show();
                                button_view.setVisibility(View.INVISIBLE);
                            }
                            else {
                                ll_data_table.removeAllViews();
                                for (int i = 0; i < newRecordList.size(); i++) {
                                    tv_current.setText(String.valueOf(i+1));
                                    addRecordView(HomeView.context, i);
                                }
                                button_view.setVisibility(View.VISIBLE);
                            }
                        }
                    }
                    else {
                        scroller_ecg.setVisibility(View.INVISIBLE);
                        scroller_data.setVisibility(View.VISIBLE);
                        content_bg_buttons.setVisibility(View.VISIBLE);
                        button_view.setImageResource(R.mipmap.icon_delete);
                        checkecg = 0;
                    }
                }
            }
        });
    }

    private void setView(byte sel) {
        switch(sel) {
            case MEASURE_VIEW:
                ECGView.setVisibility(View.VISIBLE);
                scroller_data.setVisibility(View.INVISIBLE);
                scroller_ecg.setVisibility(View.INVISIBLE);
                ECGdetail.removeAllViews();
                ll_data_table.removeAllViews();
                break;
            case DOWNLOAD_VIEW:
                ECGView.setVisibility(View.INVISIBLE);
                scroller_data.setVisibility(View.VISIBLE);
                scroller_ecg.setVisibility(View.INVISIBLE);
                ECGdetail.removeAllViews();
                ll_data_table.removeAllViews();
                addEmptytable(TABLE_LIST_SIZE);
                break;
            case RECORD_VIEW:
                ECGView.setVisibility(View.INVISIBLE);
                scroller_data.setVisibility(View.VISIBLE);
                scroller_ecg.setVisibility(View.INVISIBLE);
                ECGdetail.removeAllViews();
                ll_data_table.removeAllViews();
                addEmptytable(TABLE_LIST_SIZE);
                break;
            default:
                ECGView.setVisibility(View.VISIBLE);
                scroller_data.setVisibility(View.INVISIBLE);
                scroller_ecg.setVisibility(View.INVISIBLE);
                ECGdetail.removeAllViews();
                ll_data_table.removeAllViews();
        }
    }

    // clear table
    private void addEmptytable(int addList) {
        for (int i = 0; i < addList; i++) {

            LayoutInflater factory = LayoutInflater.from(this);
            View myView = factory.inflate(R.layout.records_content_activity, null);

            LinearLayout ll_record_content;
            ll_record_content = (LinearLayout) myView.findViewById(R.id.ll_record_content);
            ll_record_content.removeAllViews();
            ll_record_content.getLayoutParams().height = 240;
            ll_record_content.requestLayout();
            ll_data_table.addView(myView);
        }
    }

    public View addImageView(Context context) {
        LayoutInflater factory = LayoutInflater.from(context);
        View myView = factory.inflate(R.layout.ecg_images, null);
        LinearLayout ll_record_content = (LinearLayout) myView.findViewById(R.id.llo);
        ECG5SecView ivaECG = (ECG5SecView) myView.findViewById(R.id.ECGa);
        ivaECG.invalidate();
        ll_record_content.getLayoutParams().height = iECGHeight * 2;
        ll_record_content.requestLayout();
        ECGdetail.addView(myView,-1);
        return myView;
    }

    public View addRecordView(Context context, final int i) {

        // add download header view
        LayoutInflater factory = LayoutInflater.from(context);
        View myView = factory.inflate(R.layout.records_content_activity, null);
        LinearLayout ll_record_daily_sys = (LinearLayout) myView.findViewById(R.id.ll_record_daily_sys);
        LinearLayout ll_record_daily_dia = (LinearLayout) myView.findViewById(R.id.ll_record_daily_dia);
        LinearLayout ll_record_daily_bp_icon = (LinearLayout) myView.findViewById(R.id.ll_record_daily_bp_icon);
        LinearLayout ll_record_daily_bp_count = (LinearLayout) myView.findViewById(R.id.ll_record_daily_bp_count);

        int[] whoResId = {R.mipmap.icon_green, R.mipmap.icon_green, R.mipmap.icon_green, R.mipmap.icon_yellow, R.mipmap.icon_orange, R.mipmap.icon_red};
        TextView record_pulse_txt = (TextView) myView.findViewById(R.id.record_pulse_txt);
        TextView tv_record_date = (TextView) myView.findViewById(R.id.tv_record_date_text);
        LinearLayout ll_record_content = (LinearLayout) myView.findViewById(R.id.ll_record_content);
        LinearLayout ll_record_daily_score = (LinearLayout) myView.findViewById(R.id.ll_record_daily_score);
        TextView record_pulse = (TextView) myView.findViewById(R.id.record_pulse);
        TextView record_sys = (TextView) myView.findViewById(R.id.record_sys);
        TextView record_dia = (TextView) myView.findViewById(R.id.record_dia);
        TextView tv_address = (TextView) myView.findViewById(R.id.tv_address);
        TextView tv_address_title = (TextView) myView.findViewById(R.id.tv_address_title);
        Typeface tf = Typeface.createFromAsset(context.getAssets(), "fonts/FuturaCondensed.ttf");
        record_pulse.setTypeface(tf);
        record_sys.setTypeface(tf);
        record_dia.setTypeface(tf);

        ImageView[] whoIcon = new ImageView[6];
        whoIcon[0] = (ImageView) myView.findViewById(R.id.who0);
        whoIcon[1] = (ImageView) myView.findViewById(R.id.who1);
        whoIcon[2] = (ImageView) myView.findViewById(R.id.who2);
        whoIcon[3] = (ImageView) myView.findViewById(R.id.who3);
        whoIcon[4] = (ImageView) myView.findViewById(R.id.who4);
        whoIcon[5] = (ImageView) myView.findViewById(R.id.who5);
        ImageView ecg_ok = (ImageView) myView.findViewById(R.id.ecg_ok);
        ImageView ecg_rhythm = (ImageView) myView.findViewById(R.id.ecg_rhythm);
        //ImageView ecg_wave = (ImageView) myView.findViewById(R.id.ecg_wave);
        ImageView ecg_pause = (ImageView) myView.findViewById(R.id.ecg_pause);
        final CheckBox chk = (CheckBox) myView.findViewById(R.id.chk_record);

        if (view_status == RECORD_VIEW) {
            ll_record_daily_score.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View arg0) {
                    Log.d("MD", "onClick view: ");
                    try {
                        startShowECG(i);
                        iDrawCnt = 125 * 3 ;
                    } catch (IllegalArgumentException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            });
        }

        chk.setVisibility(View.VISIBLE);
        chk.setOnCheckedChangeListener(new CheckBox.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // TODO Auto-generated method stub
                if (isChecked) {
                    checkedList.add(Integer.valueOf(i));
                    checkid = i;
                } else {
                    checkedList.remove(Integer.valueOf(i));
                }
                Log.d("MD", "i=" + i + ", Checked=" + isChecked + ", List Cnt=" + checkedList.size());
            }
        });
        RecordList rec = newRecordList.get(i);
        String datetime = "20" + rec.sDatetime.substring(0, 2) + "/" + rec.sDatetime.substring(2, 4) + "/" + rec.sDatetime.substring(4, 6) + " " + rec.sDatetime.substring(6, 8) + ":"
                + rec.sDatetime.substring(8, 10) + ":" + rec.sDatetime.substring(10, 12);

        tv_record_date.setText(datetime);
        if (rec.AnalysisType == BTUtils.TYPE_BP) {
            if (rec.BPMNoiseFlag == 1)
                ecg_ok.setImageResource(R.mipmap.af_icon1);
            else
                ecg_ok.setVisibility(View.INVISIBLE);
            // invisible some text
            ecg_rhythm.setVisibility(View.INVISIBLE);
            ecg_pause.setVisibility(View.INVISIBLE);

            rec.BPHeartRate = (rec.BPHeartRate & 0x00FF);
            record_pulse.setText(String.valueOf(rec.BPHeartRate));

            rec.HighBloodPressure = (rec.HighBloodPressure & 0x00FF);
            record_sys.setText(String.valueOf(rec.HighBloodPressure));

            rec.LowBloodPressure = (rec.LowBloodPressure & 0x00FF);
            record_dia.setText(String.valueOf(rec.LowBloodPressure));

            if (rec.HighBloodPressure < 140 && rec.LowBloodPressure < 90) {
                record_sys.setTextColor(ContextCompat.getColor(context, R.color.bp_N));
                record_dia.setTextColor(ContextCompat.getColor(context, R.color.bp_N));
            } else if (rec.HighBloodPressure < 160 && rec.LowBloodPressure < 100) {
                record_sys.setTextColor(ContextCompat.getColor(context, R.color.bp_1));
                record_dia.setTextColor(ContextCompat.getColor(context, R.color.bp_1));
            } else if (rec.HighBloodPressure < 180 && rec.LowBloodPressure < 110) {
                record_sys.setTextColor(ContextCompat.getColor(context, R.color.bp_2));
                record_dia.setTextColor(ContextCompat.getColor(context, R.color.bp_2));
            } else if (rec.HighBloodPressure >= 180 || rec.LowBloodPressure >= 110) {
                record_sys.setTextColor(ContextCompat.getColor(context, R.color.bp_3));
                record_dia.setTextColor(ContextCompat.getColor(context, R.color.bp_3));
            }
            if ((rec.WHOIndicate <= whoIcon.length) && rec.WHOIndicate != 0)
                whoIcon[rec.WHOIndicate - 1].setImageResource(whoResId[rec.WHOIndicate - 1]);

        } else {
            record_pulse_txt.setText("HR");
            ll_record_daily_dia.setVisibility(View.INVISIBLE);
            ll_record_daily_sys.setVisibility(View.INVISIBLE);
            ll_record_daily_bp_icon.setVisibility(View.INVISIBLE);
            ll_record_daily_bp_count.setVisibility(View.INVISIBLE);

            if (rec.Noise == 0) {
                record_pulse.setText(String.valueOf(rec.HeartRate & 0x00FF));
                if (rec.Rhythm == 1)
                    ecg_rhythm.setImageResource(R.mipmap.rhythm_icon1);
//                if (rec.Waveform == 1)
//                    ecg_wave.setImageResource(R.mipmap.wave_icon1);
                if(rec.Pause==1)
                    ecg_pause.setImageResource(R.mipmap.pause_icon1);
                if (rec.Rhythm == 0 && rec.Waveform == 0 && rec.Pause == 0 && rec.BradycardiaValue == 0 && rec.TachycardiaValue == 0)
                    ecg_ok.setImageResource(R.mipmap.ok_icon1);
            } else
                record_pulse.setText("EE");
        }
        if (view_status == RECORD_VIEW) {
            tv_address.setVisibility(View.VISIBLE);
            tv_address_title.setVisibility(View.VISIBLE);
            tv_address.setText(rec.DeviceAddress);
        }
        else {
            tv_address.setVisibility(View.INVISIBLE);
            tv_address_title.setVisibility(View.INVISIBLE);
        }

        ll_record_content.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            if (chk.isChecked()) {
                chk.setChecked(false);
            } else {
                chk.setChecked(true);
            }
            return;
            }

        });
        ll_record_content.getLayoutParams().height = 240;
        ll_record_content.requestLayout();
        ll_data_table.addView(myView, 0);
        Log.e("MD", "add_download_view");
        return myView;
    }
    void uncheckAll() {
        //uncheck all checkbox
        View vi;
        for (int i = 0; i < ll_data_table.getChildCount(); i++) {
            vi = ll_data_table.getChildAt(i);
            CheckBox chk = (CheckBox) vi.findViewById(R.id.chk_record);
            if (chk != null) {
                chk.setChecked(false);
            }
        }
    }

    boolean startDownloadAFile(int recordIndex) {
        // start download raw data
        if (recordIndex >= newRecordList.size())
            return false;
        header = newRecordList.get(recordIndex);
        if (header.AnalysisType == BTUtils.TYPE_BP) {
            tv_percent.setText("100");
            BTUtils.saveFile(header);
            //Toast.makeText(getBaseContext(), "BP type: Raw data will not be downloaded.", Toast.LENGTH_SHORT).show();
            checkedList.remove(0);
            if (checkedList.size() > 0) {
                int iFirst = checkedList.get(0).intValue();
                startDownloadAFile(iFirst);
            }
            else {
                uncheckAll();
                procDialog.dismiss();
                Toast.makeText(getBaseContext(), "Download completed.", Toast.LENGTH_LONG).show();
            }
        }
        else {
            tv_percent.setText("0");
            BTUtils.download_file(header);
            writeFlag = 1;
            sec = 0;
            retryCmdCount = 0;
            Log.e("MD", "startDownloading..." + recordIndex);
        }
        return true;
    }

    boolean startShowECG(int recordIndex) {
        // start show ecg data
        Log.d("MD", "startShowECG index=" + recordIndex);
        if (recordIndex >= newRecordList.size())
            return false;
        header = newRecordList.get(recordIndex);
        uncheckAll();
        checkedList.clear();
        if (header.AnalysisType == BTUtils.TYPE_BP) {
            Toast.makeText(getBaseContext(), "BP type: No ECG data.", Toast.LENGTH_SHORT).show();
        } else {
            ecg_rawData = BTUtils.readecg(header.sFilename + ".txt");
            content_bg_buttons.setVisibility(View.GONE);
            scroller_ecg.scrollTo(0,0);
            scroller_ecg.setVisibility(View.VISIBLE);
            scroller_data.setVisibility(View.INVISIBLE);
            ECGdetail.removeAllViews();
            ECGdetail.setVisibility(View.VISIBLE);
            button_view.setImageResource(R.mipmap.icon_close);

            for(int i=0;i<6;i++)
                addImageView(context);

            checkecg = 1;
            iDrawCnt = 0;
            ecgSize = 1;
        }
        return true;
    }

    public class SendDownloadCmd extends TimerTask {
        public void run() {
            sec++;
            if (mBluetoothLeService != null) {
                Log.d("MD", "sec=" + sec + ",state=" + state + ",writeFlag=" + writeFlag);

                if (state != STATE_CONNECTED) {
                    Log.d("MD", "cancel()");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            timer.cancel();
                        }
                    });
                }
                if (writeFlag == 1 && sec > 3) {
                    Log.e("MD", "retry....");
                    BTUtils.resend();
                    writeFlag = 1;
                    sec = 0;
                    retryCmdCount++;
                }
                if (retryCmdCount > 3) {
                    mBluetoothLeService.disconnect();
                    writeFlag = 0;
                    retryCmdCount = 0;
                }
            } else {
                Log.d("MD", "1057");
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        timer.cancel();
                    }
                });
            }
        }
    }

    private void displayGattServices(List<BluetoothGattService> gattServices) {
        if (gattServices == null) {
            return;
        }
        String uuid = null;
        String unknownServiceString = getResources().getString(R.string.unknown_service);
        String unknownCharaString = getResources().getString(R.string.unknown_characteristic);
        ArrayList<HashMap<String, String>> gattServiceData = new ArrayList<HashMap<String, String>>();
        ArrayList<ArrayList<HashMap<String, String>>> gattCharacteristicData = new ArrayList<ArrayList<HashMap<String, String>>>();
        mGattCharacteristics = new ArrayList<ArrayList<BluetoothGattCharacteristic>>();

        // Loops through available GATT Services.
        for (BluetoothGattService gattService : gattServices) {
            HashMap<String, String> currentServiceData = new HashMap<String, String>();
            uuid = gattService.getUuid().toString();
            currentServiceData.put(LIST_NAME, SampleGattAttributes.lookup(uuid, unknownServiceString));
            currentServiceData.put(LIST_UUID, uuid);
            gattServiceData.add(currentServiceData);

            ArrayList<HashMap<String, String>> gattCharacteristicGroupData = new ArrayList<HashMap<String, String>>();
            List<BluetoothGattCharacteristic> gattCharacteristics = gattService.getCharacteristics();
            ArrayList<BluetoothGattCharacteristic> charas = new ArrayList<BluetoothGattCharacteristic>();

            // Loops through available Characteristics.
            for (BluetoothGattCharacteristic gattCharacteristic : gattCharacteristics) {
                charas.add(gattCharacteristic);
                HashMap<String, String> currentCharaData = new HashMap<String, String>();
                uuid = gattCharacteristic.getUuid().toString();
                currentCharaData.put(LIST_NAME, SampleGattAttributes.lookup(uuid, unknownCharaString));
                currentCharaData.put(LIST_UUID, uuid);
                gattCharacteristicGroupData.add(currentCharaData);

                Log.d(TAG, "uuid=" + uuid);
                if (uuid.equals("00002a36-0000-1000-8000-00805f9b34fb")) {
                    characteristic1 = gattCharacteristic;
                }
                if (uuid.equals("00002a37-0000-1000-8000-00805f9b34fb")) {
                    characteristic2 = gattCharacteristic;
                }
            }
            mGattCharacteristics.add(charas);
            gattCharacteristicData.add(gattCharacteristicGroupData);
        }

        SimpleExpandableListAdapter gattServiceAdapter = new SimpleExpandableListAdapter(this, gattServiceData, android.R.layout.simple_expandable_list_item_2, new String[]{LIST_NAME, LIST_UUID},
                new int[]{android.R.id.text1, android.R.id.text2}, gattCharacteristicData, android.R.layout.simple_expandable_list_item_2, new String[]{LIST_NAME, LIST_UUID}, new int[]{
                android.R.id.text1, android.R.id.text2});
    }

    private static IntentFilter makeGattUpdateIntentFilter() {
        final IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_CONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_DISCONNECTED);
        intentFilter.addAction(BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED);
        intentFilter.addAction(BluetoothLeService.ACTION_DATA_AVAILABLE);
        //intentFilter.addAction(JniWrapper.path);

        return intentFilter;
    }

    private void updateConnectionState(final String resourceId) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                connection_state.setText(resourceId);
            }
        });
    }

    private final BroadcastReceiver mGattUpdateReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            // receive blutetooth update
            final String action = intent.getAction();
            Log.d("BroadcastReceiver", "action=" + action);

            if (BluetoothLeService.ACTION_GATT_CONNECTED.equals(action)) {
                // Log.d(TAG, "BroadcastReceiver onReceive  [" + action + "]");
                updateConnectionState("Disconnect");
                Toast.makeText(getBaseContext(), "Connected", Toast.LENGTH_SHORT).show();
                invalidateOptionsMenu();
            } else if (BluetoothLeService.ACTION_GATT_DISCONNECTED.equals(action)) {
                // Log.d(TAG, "BroadcastReceiver onReceive  [" + action + "]");
                sec = 0;
                ll_data_table.removeAllViews();
                addEmptytable(TABLE_LIST_SIZE);
                state = STATE_DISCONNECTED;
                updateConnectionState("CONNECT");
                Toast.makeText(getBaseContext(), "Disconnect", Toast.LENGTH_SHORT).show();
            } else if (BluetoothLeService.ACTION_GATT_SERVICES_DISCOVERED.equals(action)) {
                // Log.d(TAG, "BroadcastReceiver onReceive  [" + action + "]");
                // Show all the supported services and characteristics on the user interface.
                try {
                    displayGattServices(mBluetoothLeService.getSupportedGattServices());
                    BTUtils.setCharacteristics(characteristic1, characteristic2);
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    Log.e("MD", "displayGattServices error");
                }

                state = 2;
                Log.d("MD", "ACTION_GATT_SERVICES_DISCOVERED");
                if (characteristic1 != null) {
                    try {
                        mBluetoothLeService.setCharacteristicNotification(characteristic1, true);
                        Log.d("MD", "setCharacteristicNotification sucess");
                        timer = new Timer(true);
                        timer.schedule(new SendDownloadCmd(), 1000, 1000);
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        Log.e("MD", "setCharacteristicNotification error");
                    }
                } else {
                    Log.e("MD", "characteristic1==null");
                }
            } else if (BluetoothLeService.ACTION_DATA_AVAILABLE.equals(action)) {
                // get return value
                final int[] value = intent.getIntArrayExtra(BluetoothLeService.EXTRA_DATA);
                DataList res = BTUtils.functionBLE(value);
                int format = res.rformat;
                int bpCmd = res.rbpCmd;
                if (format == BT_MEASURE) { // measure mode, return: measured data array
                    if (newMeasure) {//clear
                        tv_percent.setText("0");
                        tv_current.setText("0");
                        tv_total.setText("0");
                        newMeasure = false;
                        view_status = MEASURE_VIEW;
                        setView(view_status);
                        tv_measure_hr.setText("--");
                        tv_measure_bp.setText("--");
                        tv_mmhgtitle.setText("mmHg");
                        ecgCount = 0;
                        displayCount = 0;
                        Measure_Header = true;
                        checkedList.clear();
                    }

                    for (int i = 0; i < 8; i+=2) {
                        ChannelNo = res.measured[i];
                        if (ChannelNo == CH_HR) {//HR
                            HeartRate = res.measured[i+1];
                            tv_measure_hr.setText(String.valueOf(HeartRate));
                            tv_measure_bp.setText("- -");
                        }
                        else if (ChannelNo == CH_MMHG) {//BP
                            bpDiastolic = res.measured[i+1];
                            tv_measure_bp.setText(String.valueOf(bpDiastolic));
                            tv_measure_hr.setText("- -");
                        }
                        else if (ChannelNo == CH_AUTOSCALE) {
                            ecgSize = res.measured[i+1];
                        }
                        else if (ChannelNo == CH_ECG) {
                            MDRawData = res.measured[i+1];
                            tv_measure_bp.setText("- -");
                            if (ecgCount < ecg_rawData.length) {
                                if (bECGMode == false) {
                                    bECGMode = true;
                                    iv_ECG.setVisibility(View.VISIBLE);
                                }
                                iv_ECG.invalidate();
                            }
                        }
                    }
                }
                else if (format == BT_HEADER) { // header mode, return: record list of header
                    if (bpCmd < 5 && Measure_Header) {
                        newMeasure = true;
                        Measure_Header = false;
                        rec_n = res.record;
                        if (rec_n.AnalysisType == BTUtils.TYPE_BP) {
                            rec_n.BPHeartRate = rec_n.BPHeartRate;
                            rec_n.HighBloodPressure = (rec_n.HighBloodPressure & 0x00FF);
                            rec_n.LowBloodPressure = (rec_n.LowBloodPressure & 0x00FF);

                            tv_measure_hr.setText(String.valueOf(rec_n.BPHeartRate));
                            tv_mmhgtitle.setText("Sys: \nDia: ");
                            tv_measure_bp.setText(rec_n.HighBloodPressure + "\n" + rec_n.LowBloodPressure);
                            button_view.setVisibility(View.INVISIBLE);
                        }
                        else {
                            if (rec_n.Noise == 0) {
                                tv_measure_hr.setText(String.valueOf(rec_n.BPHeartRate));
                                tv_mmhgtitle.setText("mmHg");
                                tv_measure_bp.setText("--");
                            } else
                                tv_measure_hr.setText("EE");
                            button_view.setVisibility(View.VISIBLE);
                            button_view.setImageResource(R.mipmap.button_ecg);
                        }
                        bECGMode = false;
                        checkedList.clear();
                    }
                }
                else if (format == BT_CONFIG_INFO) { // get device information, return: deviceID, Firmware Version
                    if (bpCmd == BT_CONFIG_INFO_DEVICE) {
                        dID = res.vDeviceID;
                    }
                    else if (bpCmd == BT_CONFIG_INFO_SETTING) {
                        String t = String.format("%08x", dID);
                        Toast.makeText(getBaseContext(), "Device ID: " + t + "\nFW_Version=" + res.FirmwareVersion, Toast.LENGTH_SHORT).show();
                    }
                }
                else if (format == BT_SETUP) { // set up time
                    Toast.makeText(getBaseContext(), "Set time success. ", Toast.LENGTH_SHORT).show();
                }
                else if (format == BT_ERASE_FLASH) { // delete user raw data
                    Toast.makeText(getBaseContext(), "Delete data success. ", Toast.LENGTH_SHORT).show();
                    writeFlag = 0;
                    downloadCount = 0;
                    checkedList.clear();
                    sec = 0;
                    ll_data_table.removeAllViews();
                    tv_current.setText("0");
                    tv_total.setText("No Data");
                }
                else if (format == BT_DOWNLOAD) { // download header and raw data
                    if (bpCmd == BT_DOWNLOAD_U1_COUNT || bpCmd == BT_DOWNLOAD_U2_COUNT) {
                        writeFlag = 0;
                        downloadCount = 0;
                        checkedList.clear();
                        sec = 0;
                        ll_data_table.removeAllViews();
                        if (totalCount > 0) {
                            tv_total.setText(String.valueOf(totalCount));
                            writeFlag = 1;
                            sec = 0;
                        } else {
                            writeFlag = 0;
                            tv_total.setText("No Data");
                        }
                    }
                    else if (bpCmd == BT_DOWNLOAD_HEADER) { //return: lost, header, record
                        if (downloadCount < totalCount) {
                            if (res.lost == 1) {
                                writeFlag = 1;
                                sec = 0;
                                lost = 0;
                                retryCmdCount = 0;
                                return;
                            }

                            if(downloadCount==0)
                            {
                                procDialog = new ProgressDialog(context);
                                //procDialog.setTitle(R.string.app_name);
                                //procDialog.setTitle("please wait");
                                procDialog.setMax(totalCount);
                                procDialog.setCancelable(false);
                                procDialog.setProgress(0);
                                procDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                                procDialog.show();
                            }

                            procDialog.incrementProgressBy(1);
                            if(downloadCount == totalCount - 1)
                                procDialog.dismiss();

                            writeFlag = 0;
                            sec = 0;
                            newRecordList.add(res.record);

                            downloadCount++;
                            addRecordView(HomeView.context, downloadCount - 1);
                            tv_current.setText(String.valueOf(downloadCount));

                            if ((downloadCount < totalCount)) {
                                writeFlag = 1;
                                sec = 0;
                                lost = 0;
                                retryCmdCount = 0;
                            }
                        }
                    }
                    else if (bpCmd == BT_DOWNLOAD_RAWD) { //return: lost, finished, percent
                        writeFlag = 0;
                        sec = 0;

                        if (res.lost == 1) {
                            lost = 0;
                            writeFlag = 1;
                            sec = 0;
                            retryCmdCount = 0;
                            return;
                        }
                        if (res.finished == 1) {
                            writeFlag = 0;
                            sec = 0;
                            retryCmdCount = 0;

                            BTUtils.saveFile(header);
                            checkedList.remove(0);
                            if (checkedList.size() > 0) {
                                int iFirst = checkedList.get(0).intValue();
                                startDownloadAFile(iFirst);
                            } else {
                                uncheckAll();
                                procDialog.dismiss();
                                Toast.makeText(getBaseContext(), "Download completed.", Toast.LENGTH_LONG).show();
                            }
                        } else {
                            writeFlag = 1;
                            sec = 0;
                            retryCmdCount = 0;
                        }
                        if(res.percent > 0) {
                            procDialog.setMessage(String.valueOf(res.percent) + "% completed in file " + (downloadFileCnt - checkedList.size() + 1) + "/" + downloadFileCnt);
                            tv_percent.setText(String.valueOf(res.percent));
                        }
                    }
                }
            }
        }
    };

}