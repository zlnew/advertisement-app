<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdRequest;
use App\Http\Requests\UpdateAdRequest;
use App\Http\Resources\AdResource;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $adBuilder = Ad::query()
            ->where('user_id', Auth::user()->id);

        if ($request->get('search')) {
            $adBuilder
                ->where('type', 'LIKE', '%'.$request->get('search').'%')
                ->orWhere('title', 'LIKE', '%'.$request->get('search').'%');
        }

        $ads = $adBuilder->get();

        return new AdResource($ads);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdRequest $request)
    {
        $validated = $request->safe();

        $ad = new Ad();

        $ad->fill([
            'user_id' => $request->user()->id,
            'type' => $validated->type,
            'title' => $validated->title,
            'description' => $validated->description
        ]);

        $ad->save();

        $data = Ad::findOrFail($ad->id);

        return response([
            'data' => new AdResource($data)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ad $ad)
    {
        return new AdResource($ad);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdRequest $request, Ad $ad)
    {
        $validated = $request->safe();

        $ad->fill([
            'user_id' => $request->user()->id,
            'type' => $validated->type,
            'title' => $validated->title,
            'description' => $validated->description
        ]);

        $ad->save();

        $data = Ad::findOrFail($ad->id);

        return response([
            'data' => new AdResource($data)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ad $ad)
    {
        $ad->delete();

        return response()->noContent();
    }
}
