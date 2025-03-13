<?php

namespace App\Http\Controllers;

use App\Models\PaymentTransaction;
use App\Mpesa\STKPush;
use App\Models\MpesaSTK;
use App\Notifications\PaymentConfirmation;
use Carbon\Carbon;
use Iankumu\Mpesa\Facades\Mpesa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MpesaSTKPUSHController extends Controller
{

    public function STKConfirm(Request $request)
    {
        $stk_push_confirm = (new STKPush())->confirm($request);
        $result_code = $stk_push_confirm->failed ? 1 : 0;
        $result_desc = $stk_push_confirm->failed ? $stk_push_confirm->response : 'Success';
        Log::info("STK Confirmation result code: " . $result_code);
        return response()->json([
            'ResultCode' => $result_code,
            'ResultDesc' => $result_desc,
            'CheckoutRequestID' => $stk_push_confirm->checkout_request_id,
            'Data' => $stk_push_confirm->data
        ]);
    }
}
