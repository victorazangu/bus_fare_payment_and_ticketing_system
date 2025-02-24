<?php

namespace App\Http\Controllers;

use App\Models\PaymentTransaction;
use App\Mpesa\STKPush;
use App\Models\MpesaSTK;
use App\Notifications\PaymentConfirmation;
use Carbon\Carbon;
use Iankumu\Mpesa\Facades\Mpesa;
use Illuminate\Http\Request;

class MpesaSTKPUSHController extends Controller
{

    public $result_code = 1;
    public $result_desc = 'An error occured';
    public function STKConfirm(Request $request)
    {
        $stk_push_confirm = (new STKPush())->confirm($request);
        if ($stk_push_confirm) {
            $this->result_code = 0;
            $this->result_desc = 'Success';

            $paymentTransaction = PaymentTransaction::with(["booking"])->findOrFail($stk_push_confirm->checkout_request);
            $booking = $paymentTransaction->booking;
            $booking->payment_status = 'paid';
            $booking->save();
            $paymentTransaction->booking->user->notify(new PaymentConfirmation($paymentTransaction));
            return redirect()->back()->with("success", $this->result_desc);
        }
        return  redirect()->back()->with("error", $this->result_desc);

    }
}
