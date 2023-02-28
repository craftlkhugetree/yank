package com.mdbiomedical.app.demomdble;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;

public class ECGImageView extends View {

	Paint paint = new Paint();
	Path trace = new Path();
	int iECGWidth, iECGHeight, iBaseLine;
	float fGridHeight, fCell;
	float fMvAmp;
	float fGen = 65536 / 600;
	float fPixelPerSample;
	public float fPixelPerAmp;
	public static int ecgSize = 1;
	public boolean bBkgd = false;
	public int temp_max = 0;

	public ECGImageView(Context context, AttributeSet attrs) {
		super(context, attrs);
	}

	/*
	 * @Override public boolean onTouchEvent(MotionEvent e) { return
	 * mDetector.onTouchEvent(e); }
	 */
	public void drawECGBkgd(Canvas canvas) {
		iECGWidth = HomeView.iECGWidth;
		iECGHeight = HomeView.iECGHeight;
		//ECG
		iBaseLine = iECGHeight / 2;
		fMvAmp = iECGWidth * 2 / 5 / 5;
		fPixelPerAmp = fMvAmp / fGen * ecgSize;
		fPixelPerSample = (float) iECGWidth / (2 * 125);
		temp_max = 0;
		fGridHeight = iECGWidth / 2;
		fCell = iECGWidth / 10;
	}

	@Override
	public void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		if (bBkgd == false) {
			drawECGBkgd(canvas);
			bBkgd = true;
		}

		paint.setColor(Color.WHITE);
		paint.setStyle(Paint.Style.FILL_AND_STROKE);
		canvas.drawRect(new RectF(0, 0, iECGHeight, iECGWidth), paint); //iECGHeight * 6

		int ecg_grid1 = getResources().getColor(R.color.ecg_grid1);
		int ecg_grid2 = getResources().getColor(R.color.ecg_grid2);
		int ecg_grid3 = getResources().getColor(R.color.ecg_grid3);
		float iGridHeight = iECGWidth/2; // always display 5 seconds	//5
		float iCell = iECGWidth / 10;	//25
		float iSmallCell = iECGWidth / 50;	//125
		//Log.e("tina", "ecgSize = "+ecgSize+"");
		for (float i = 0; i < iECGWidth; i += iGridHeight) {// 粗直線		//iECGHeight * 6
			paint.setColor(ecg_grid3);
			paint.setStrokeWidth(3);
			canvas.drawLine(i, 0, i, iECGHeight, paint);
			paint.setStrokeWidth(1);
			for (float j = i; j < i + iGridHeight - iCell + 1; j += iCell) { // 直線

				paint.setColor(ecg_grid2);
				paint.setStrokeWidth(2);
				canvas.drawLine(j, 0, j, iECGHeight, paint);
				paint.setStrokeWidth(1);
				paint.setColor(ecg_grid1);
				for (float k = iSmallCell; k < iCell - iSmallCell + 1; k += iSmallCell) {
					canvas.drawLine(j + k, 0, j + k, iECGHeight, paint);// 細直線
				}
			}
		}

		paint.setStyle(Paint.Style.STROKE);
		paint.setStrokeWidth(1);
		for (int i = iECGHeight; i > 0; i -= iCell) {// 橫線
			paint.setStrokeWidth(2);
			canvas.drawLine(0, i, iECGWidth, i, paint);		//iECGHeight * 6
			paint.setStrokeWidth(1);
			for (int k = 1; k < 5; k++) {// 細衡線
				canvas.drawLine(0, i - k * iSmallCell, iECGWidth, i - k * iSmallCell, paint);		//iECGHeight * 6
			}
		}
		//canvas.restore();

//		paint.setColor(Color.BLACK);
//		paint.setStrokeWidth(4);
//
//		// canvas.drawLine(iECGWidth - iCell * 3, iCell, iECGWidth - iCell *
//		// 3, iCell + iSmallCell, myPaint);
//		// canvas.drawLine(iECGWidth - iCell * 3, iCell + iSmallCell * 3,
//		// iECGWidth - iCell * 3, iCell + iSmallCell * 4, myPaint);
//		// canvas.drawLine(iECGWidth - iCell * 1, iCell + iSmallCell * 1,
//		// iECGWidth - iCell * 1, iCell + iSmallCell * 3, myPaint);
//		// canvas.drawLine(iECGWidth - iCell * 3, iCell + iSmallCell * 1,
//		// iECGWidth - iCell * 1, iCell + iSmallCell * 1, myPaint);
//		// canvas.drawLine(iECGWidth - iCell * 3, iCell + iSmallCell * 3,
//		// iECGWidth - iCell * 1, iCell + iSmallCell * 3, myPaint);
//		canvas.drawLine(iCell + iSmallCell, iECGHeight - iCell * (1), iCell, iECGHeight - iCell * (1), paint);
//		canvas.drawLine(iCell + iSmallCell * 4, iECGHeight - iCell * (1), iCell + iSmallCell * 3, iECGHeight - iCell * (1), paint);
//		canvas.drawLine(iCell + iSmallCell * 3, iECGHeight - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 1, iECGHeight - iCell * (3 + (ecgSize - 1) * 2), paint);
//		canvas.drawLine(iCell + iSmallCell * 1, iECGHeight - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 1, iECGHeight - iCell * (1), paint);
//		canvas.drawLine(iCell + iSmallCell * 3, iECGHeight - iCell * (3 + (ecgSize - 1) * 2), iCell + iSmallCell * 3, iECGHeight - iCell * (1), paint);
//		canvas.save();
//		paint.setStyle(Paint.Style.FILL_AND_STROKE);
//		paint.setStrokeWidth(2);
//		paint.setTextSize(36);
//		// canvas.rotate(90, iECGWidth - iCell * 3 - iSmallCell * 2, iCell);
//		//canvas.rotate(90, iCell, iECGWidth - iCell * (3 + (ecgSize - 1) * 2) - iSmallCell * 2);
//		// canvas.drawText("1 mV", iECGWidth - iCell * 3 - iSmallCell * 2,
//		// iCell, myPaint);
//		canvas.drawText("1 mV", iCell, iECGHeight - (iSmallCell * 2), paint);
//		canvas.restore();

		paint.setStyle(Paint.Style.STROKE);
		paint.setColor(Color.rgb(0, 0, 0));
		paint.setStrokeWidth(5);

		short iDrawCnt = (short) (HomeView.displayCount - HomeView.displayCount % (125 * 2));
		int iLineSt = iDrawCnt;
		float fAmp = HomeView.displayData[iDrawCnt] * fPixelPerAmp;
		if (fAmp > iBaseLine)
			fAmp = iBaseLine;
		else if (fAmp < 0 - iBaseLine)
			fAmp = 0 - iBaseLine;
		trace.rewind();
		trace.moveTo(0, iBaseLine - fAmp);

		for (int i = 0; iDrawCnt < HomeView.ecgCount - 125 * 3 && i <= 125 * 2; iDrawCnt++, i++) {

			float fPos = i * fPixelPerSample;

			fAmp = HomeView.displayData[iDrawCnt] * fPixelPerAmp;

			if (fAmp > iBaseLine)
				fAmp = iBaseLine;
			else if (fAmp < 0 - iBaseLine)
				fAmp = 0 - iBaseLine;

			trace.lineTo(fPos, iBaseLine - fAmp);
			if (iLineSt == 2*125) {
				temp_max = iLineSt;
				ecgSize = 1;
			}
			if (temp_max < iLineSt) {
				temp_max = iLineSt;
				if (HomeView.ecgSize == 1 || HomeView.ecgSize == 2)
					ecgSize = 1;
				if (HomeView.ecgSize == 3)
					ecgSize = 2;
				if (HomeView.ecgSize == 4)
					ecgSize = 3;

				fPixelPerAmp = fMvAmp / fGen * ecgSize;
			}
		}
		canvas.drawPath(trace, paint);
		canvas.save();

	}
}
