package com.mdbiomedical.app.demomdble;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;

public class ECG5SecView extends View {

	Paint myPaint = new Paint();
	Path trace = new Path();
	int iECGWidth, iECGHeight, iBaseLine;
	int iIndex = 0;
	float fGen = 65536 / 600;
	float fPixelPerSample;
	public static float ecgSize = 1;
	public boolean bBkgd = false;
	float fMvAmp;
	public float fPixelPerAmp;
    public Bitmap bm;
	public int temp_max = 0;
	public ECG5SecView(Context context, AttributeSet attrs) {
		super(context, attrs);
		// TODO Auto-generated constructor stub
	}


	public void drawECGBkgd(Canvas canvas) {
		iECGWidth = HomeView.iECGWidth;
		iECGHeight = HomeView.iECGHeight * 2;//HomeView.allECGHeight

		//ECG
		iBaseLine = iECGWidth / 2;
		fMvAmp = iECGHeight * 2 / 5 / 5;

		fPixelPerSample = (float) iECGHeight / (5 * 125);
	}
	@Override
	protected void onDraw(Canvas canvas) {
        //bm = Bitmap.createBitmap(320, 480, Bitmap.Config.ARGB_8888);
        //canvas = new Canvas(bm);
        // TODO Auto-generated method stub
		super.onDraw(canvas);

			drawECGBkgd(canvas);
		ecgSize = 1;
		fPixelPerAmp = fMvAmp / fGen * ecgSize;

		myPaint.setColor(Color.WHITE);
		myPaint.setStyle(Paint.Style.FILL_AND_STROKE);
		canvas.drawRect(new RectF(0, 0, iECGWidth, iECGHeight), myPaint); //iECGHeight * 6

		int ecg_grid1 = getResources().getColor(R.color.ecg_grid1);
		int ecg_grid2 = getResources().getColor(R.color.ecg_grid2);
		int ecg_grid3 = getResources().getColor(R.color.ecg_grid3);
		float iGridHeight = iECGHeight/5; // always display 5 seconds
		float iCell = iECGHeight / 25;
		float iSmallCell = iECGHeight / 125;
		//Log.e("tina", "ecgSize = "+ecgSize+"");
		for (float i = 0; i < iECGHeight; i += iGridHeight) {// 粗直線		//iECGHeight * 6
			myPaint.setColor(ecg_grid3);
			myPaint.setStrokeWidth(3);
			canvas.drawLine(0, i, iECGWidth, i, myPaint);
			myPaint.setStrokeWidth(1);
			for (float j = i; j < i + iGridHeight - iCell + 1; j += iCell) { // 直線

				myPaint.setColor(ecg_grid2);
				myPaint.setStrokeWidth(2);
				canvas.drawLine(0, j, iECGWidth, j, myPaint);
				myPaint.setStrokeWidth(1);
				myPaint.setColor(ecg_grid1);
				for (float k = iSmallCell; k < iCell - iSmallCell + 1; k += iSmallCell) {
					canvas.drawLine(0, j + k, iECGWidth, j + k, myPaint);// 細直線
				}
			}
		}

		myPaint.setStyle(Paint.Style.STROKE);
		myPaint.setStrokeWidth(1);
		for (int i = iECGWidth; i > 0; i -= iCell) {// 橫線
			myPaint.setStrokeWidth(2);
			canvas.drawLine(i, 0, i, iECGHeight, myPaint);		//iECGHeight * 6
			myPaint.setStrokeWidth(1);
			for (int k = 1; k < 5; k++) {// 細衡線
				canvas.drawLine(i - k * iSmallCell, 0, i - k * iSmallCell, iECGHeight, myPaint);		//iECGHeight * 6
			}
		}


		myPaint.setColor(Color.BLACK);
		myPaint.setStrokeWidth(4);

		// canvas.drawLine(iECGWidth - iCell * 3, iCell, iECGWidth - iCell *
		// 3, iCell + iSmallCell, myPaint);
		// canvas.drawLine(iECGWidth - iCell * 3, iCell + iSmallCell * 3,
		// iECGWidth - iCell * 3, iCell + iSmallCell * 4, myPaint);
		// canvas.drawLine(iECGWidth - iCell * 1, iCell + iSmallCell * 1,
		// iECGWidth - iCell * 1, iCell + iSmallCell * 3, myPaint);
		// canvas.drawLine(iECGWidth - iCell * 3, iCell + iSmallCell * 1,
		// iECGWidth - iCell * 1, iCell + iSmallCell * 1, myPaint);
		// canvas.drawLine(iECGWidth - iCell * 3, iCell + iSmallCell * 3,
		// iECGWidth - iCell * 1, iCell + iSmallCell * 3, myPaint);
		canvas.drawLine(iECGWidth - iCell * (3 + (ecgSize - 1) * 2), iCell, iECGWidth - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell, myPaint);
		canvas.drawLine(iECGWidth - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 3, iECGWidth - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 4, myPaint);
		canvas.drawLine(iECGWidth - iCell * 1, iCell + iSmallCell * 1, iECGWidth - iCell * 1, iCell + iSmallCell * 3, myPaint);
		canvas.drawLine(iECGWidth - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 1, iECGWidth - iCell * 1, iCell + iSmallCell * 1, myPaint);
		canvas.drawLine(iECGWidth - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 3, iECGWidth - iCell * 1, iCell + iSmallCell * 3, myPaint);
		canvas.save();
		myPaint.setStyle(Paint.Style.FILL_AND_STROKE);
		myPaint.setStrokeWidth(2);
		myPaint.setTextSize(24);
		// canvas.rotate(90, iECGWidth - iCell * 3 - iSmallCell * 2, iCell);
		canvas.rotate(90, iECGWidth - iCell * (3 + (ecgSize - 1) * 2) - iSmallCell * 2, iCell);
		// canvas.drawText("1 mV", iECGWidth - iCell * 3 - iSmallCell * 2,
		// iCell, myPaint);
		canvas.drawText("1 mV", iECGWidth - iCell * (3 + (ecgSize - 1) * 2) - iSmallCell * 2, iCell, myPaint);
		canvas.restore();



		myPaint.setStyle(Paint.Style.STROKE);
		myPaint.setColor(Color.rgb(0, 0, 0));
		myPaint.setStrokeWidth(5);
		float fAmp;
		//short iDrawCnt = (short) HomeView.iDrawCnt;
		if(HomeView.iDrawCnt == 0)
			fAmp = HomeView.ecg_rawData[HomeView.iDrawCnt++] * fPixelPerAmp;
		else
			fAmp = HomeView.ecg_rawData[HomeView.iDrawCnt - 1] * fPixelPerAmp;

		if (fAmp > iBaseLine)
			fAmp = iBaseLine;
		else if (fAmp < 0 - iBaseLine)
			fAmp = 0 - iBaseLine;
		trace.rewind();
		trace.moveTo(iBaseLine + fAmp, 0);

		for (int i = 0; i < 125 * 5 && HomeView.iDrawCnt <= 125 * 33 ; HomeView.iDrawCnt++, i++) {

			float fPos = i * fPixelPerSample;

			fAmp = HomeView.ecg_rawData[HomeView.iDrawCnt] * fPixelPerAmp;

			if (fAmp > iBaseLine)
				fAmp = iBaseLine;
			else if (fAmp < 0 - iBaseLine)
				fAmp = 0 - iBaseLine;

			trace.lineTo(iBaseLine + fAmp, fPos);

		}
		canvas.drawPath(trace, myPaint);
		canvas.save();
		myPaint.setStyle(Paint.Style.FILL_AND_STROKE);
		myPaint.setStrokeWidth(1);
		myPaint.setTextSize(36);
		canvas.rotate(90, 30, iECGHeight - 50);
		canvas.drawPath(trace, myPaint);
		canvas.drawText(String.valueOf((HomeView.iDrawCnt-125 * 3) / 125)+"("+getResources().getString(R.string.sec)+")", -140, iECGHeight-50, myPaint);
	}

}
