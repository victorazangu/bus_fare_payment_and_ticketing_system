<?php

namespace App\Mpesa;

use App\Models\MpesaSTK;
use App\Models\User;
use App\Models\PaymentTransaction;
use App\Notifications\PaymentConfirmation;
use Illuminate\Http\Request;

class STKPush
{
    public $failed = false;
    public $response = 'An Unknown Error Occurred';
    public $checkout_request_id = null;
    public $data = [];

    public function confirm(Request $request)
    {
        $payload = json_decode($request->getContent());

        if (property_exists($payload, 'Body')) {
            $merchant_request_id = $payload->Body->stkCallback->MerchantRequestID;
            $checkout_request_id = $payload->Body->stkCallback->CheckoutRequestID;
            $result_desc = $payload->Body->stkCallback->ResultDesc;
            $result_code = $payload->Body->stkCallback->ResultCode;

            $this->checkout_request_id = $checkout_request_id;
            $stkPush = MpesaSTK::where('merchant_request_id', $merchant_request_id)
                ->where('checkout_request_id', $checkout_request_id)->first();

            if ($result_code == '0') {
                $amount = $payload->Body->stkCallback->CallbackMetadata->Item[0]->Value;
                $mpesa_receipt_number = $payload->Body->stkCallback->CallbackMetadata->Item[1]->Value;
                $transaction_date = $payload->Body->stkCallback->CallbackMetadata->Item[3]->Value;
                $phonenumber = $payload->Body->stkCallback->CallbackMetadata->Item[4]->Value;

                $this->data = [
                    'result_desc' => $result_desc,
                    'result_code' => $result_code,
                    'merchant_request_id' => $merchant_request_id,
                    'checkout_request_id' => $checkout_request_id,
                    'amount' => $amount,
                    'mpesa_receipt_number' => $mpesa_receipt_number,
                    'transaction_date' => $transaction_date,
                    'phonenumber' => $phonenumber,
                ];

                if ($stkPush) {
                    $stkPush->fill($this->data)->save();
                } else {
                    $stkPush = MpesaSTK::create($this->data);
                }
                $paymentTransaction = new PaymentTransaction();
                $paymentTransaction->transaction_id = $mpesa_receipt_number;
                $paymentTransaction->amount = $amount;
                $paymentTransaction->payment_method = 'mpesa';
                $paymentTransaction->payment_date = now();
                $user = User::where("phone", $phonenumber)->first();
                if ($user) {
                    $user->notify(new PaymentConfirmation($paymentTransaction));
                }
            } else {
                $this->failed = true;
                $this->response = $result_desc;

                $this->data = [
                    'result_desc' => $result_desc,
                    'result_code' => $result_code,
                    'merchant_request_id' => $merchant_request_id,
                    'checkout_request_id' => $checkout_request_id,
                ];
                if ($stkPush) {
                    $stkPush->fill($this->data)->save();
                    $phonenumber = $stkPush->phonenumber;
                    if ($phonenumber) {
                        $user = User::where("phone", $phonenumber)->first();
                        if ($user) {
                            $failedTransaction = new PaymentTransaction();
                            $failedTransaction->transaction_id = 'FAILED-'.$checkout_request_id;
                            $failedTransaction->amount = $stkPush->amount ?? 0;
                            $failedTransaction->payment_method = 'mpesa';
                            $failedTransaction->payment_date = now();
                            $failedTransaction->status = 'failed';
                            $user->notify(new PaymentConfirmation($failedTransaction));
                        }
                    }
                } else {
                    MpesaSTK::create($this->data);
                }
            }
        } else {
            $this->failed = true;
            $this->response = 'Invalid STK callback payload';
        }

        return $this;
    }
}
