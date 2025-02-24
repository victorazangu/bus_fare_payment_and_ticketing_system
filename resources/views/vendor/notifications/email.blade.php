<x-mail::message>
    <div style="text-align: center; margin-bottom: 20px;">
        <img src="{{ asset('storage/images/logo.png') }}" alt="Logo" width="150">
    </div>
    @if (! empty($greeting))
        <h1 style="font-size: 24px; color: #333; text-align: start;">{{ $greeting }}</h1>
    @else
        @if ($level === 'error')
            <h1 style="font-size: 24px; color: #d9534f; text-align: start;">@lang('Whoops!')</h1>
        @else
            <h1 style="font-size: 24px; color: #333; text-align: start;">@lang('Hello!')</h1>
        @endif
    @endif
    @foreach ($introLines as $line)
        <p style="font-size: 16px; color: #555; line-height: 1.6; text-align: start;">
            {{ $line }}
        </p>
    @endforeach
    @isset($actionText)
            <?php
            $color = match ($level) {
                'success', 'error' => $level,
                default => 'primary',
            };
            ?>
        <div style="text-align: center; margin-top: 20px;">
            <x-mail::button :url="$actionUrl" :color="$color" style="font-size: 16px; padding: 12px 30px;">
                {{ $actionText }}
            </x-mail::button>
        </div>
    @endisset
    @foreach ($outroLines as $line)
        <p style="font-size: 16px; color: #555; line-height: 1.6; text-align: start;">
            {{ $line }}
        </p>
    @endforeach
    @if (! empty($salutation))
        <p style="font-size: 16px; color: #555; text-align: start;">{{ $salutation }}</p>
    @else
        <p style="font-size: 16px; color: #555; text-align: start;">
            @lang('Regards,')<br>
            <strong>{{ config('app.name') }}</strong>
        </p>
    @endif
    @isset($actionText)
        <x-slot:subcopy>
            <div style="font-size: 14px; color: #6c757d; text-align: center; margin-top: 20px; max-width: fit-content;">
                @lang("If you're having trouble clicking the \":actionText\" button, copy and paste the URL below into your web browser.")
                <br>
                <span style="word-break: break-all; font-weight: bold; color: #007bff;">
                [{{ $displayableActionUrl }}]({{ $actionUrl }})
            </span>
            </div>
        </x-slot:subcopy>
    @endisset

</x-mail::message>
