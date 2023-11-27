"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import builtins
import collections.abc
import google.protobuf.descriptor
import google.protobuf.internal.containers
import google.protobuf.internal.enum_type_wrapper
import google.protobuf.message
import s2clientprotocol.common_pb2
import sys
import typing

if sys.version_info >= (3, 10):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

class _Attribute:
    ValueType = typing.NewType("ValueType", builtins.int)
    V: typing_extensions.TypeAlias = ValueType

class _AttributeEnumTypeWrapper(google.protobuf.internal.enum_type_wrapper._EnumTypeWrapper[_Attribute.ValueType], builtins.type):
    DESCRIPTOR: google.protobuf.descriptor.EnumDescriptor
    Light: _Attribute.ValueType  # 1
    Armored: _Attribute.ValueType  # 2
    Biological: _Attribute.ValueType  # 3
    Mechanical: _Attribute.ValueType  # 4
    Robotic: _Attribute.ValueType  # 5
    Psionic: _Attribute.ValueType  # 6
    Massive: _Attribute.ValueType  # 7
    Structure: _Attribute.ValueType  # 8
    Hover: _Attribute.ValueType  # 9
    Heroic: _Attribute.ValueType  # 10
    Summoned: _Attribute.ValueType  # 11

class Attribute(_Attribute, metaclass=_AttributeEnumTypeWrapper): ...

Light: Attribute.ValueType  # 1
Armored: Attribute.ValueType  # 2
Biological: Attribute.ValueType  # 3
Mechanical: Attribute.ValueType  # 4
Robotic: Attribute.ValueType  # 5
Psionic: Attribute.ValueType  # 6
Massive: Attribute.ValueType  # 7
Structure: Attribute.ValueType  # 8
Hover: Attribute.ValueType  # 9
Heroic: Attribute.ValueType  # 10
Summoned: Attribute.ValueType  # 11
global___Attribute = Attribute

@typing_extensions.final
class AbilityData(google.protobuf.message.Message):
    """May not relevant: queueable (everything is queueable).
    May not be important: AbilSetId - marine stim, marauder stim.
    Stuff omitted: transient.
    Stuff that may be important: cost, range, Alignment, targetfilters.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    class _Target:
        ValueType = typing.NewType("ValueType", builtins.int)
        V: typing_extensions.TypeAlias = ValueType

    class _TargetEnumTypeWrapper(google.protobuf.internal.enum_type_wrapper._EnumTypeWrapper[AbilityData._Target.ValueType], builtins.type):  # noqa: F821
        DESCRIPTOR: google.protobuf.descriptor.EnumDescriptor
        Point: AbilityData._Target.ValueType  # 2
        """Requires a target position."""
        Unit: AbilityData._Target.ValueType  # 3
        """Requires a unit to target. Given by position using feature layers."""
        PointOrUnit: AbilityData._Target.ValueType  # 4
        """Requires either a target point or target unit."""
        PointOrNone: AbilityData._Target.ValueType  # 5
        """Requires either a target point or no target. (eg. building add-ons)"""

    class Target(_Target, metaclass=_TargetEnumTypeWrapper): ...
    Point: AbilityData.Target.ValueType  # 2
    """Requires a target position."""
    Unit: AbilityData.Target.ValueType  # 3
    """Requires a unit to target. Given by position using feature layers."""
    PointOrUnit: AbilityData.Target.ValueType  # 4
    """Requires either a target point or target unit."""
    PointOrNone: AbilityData.Target.ValueType  # 5
    """Requires either a target point or no target. (eg. building add-ons)"""

    ABILITY_ID_FIELD_NUMBER: builtins.int
    LINK_NAME_FIELD_NUMBER: builtins.int
    LINK_INDEX_FIELD_NUMBER: builtins.int
    BUTTON_NAME_FIELD_NUMBER: builtins.int
    FRIENDLY_NAME_FIELD_NUMBER: builtins.int
    HOTKEY_FIELD_NUMBER: builtins.int
    REMAPS_TO_ABILITY_ID_FIELD_NUMBER: builtins.int
    AVAILABLE_FIELD_NUMBER: builtins.int
    TARGET_FIELD_NUMBER: builtins.int
    ALLOW_MINIMAP_FIELD_NUMBER: builtins.int
    ALLOW_AUTOCAST_FIELD_NUMBER: builtins.int
    IS_BUILDING_FIELD_NUMBER: builtins.int
    FOOTPRINT_RADIUS_FIELD_NUMBER: builtins.int
    IS_INSTANT_PLACEMENT_FIELD_NUMBER: builtins.int
    CAST_RANGE_FIELD_NUMBER: builtins.int
    ability_id: builtins.int
    """Stable ID."""
    link_name: builtins.str
    """Catalog name of the ability."""
    link_index: builtins.int
    """Catalog index of the ability."""
    button_name: builtins.str
    """Name used for the command card. May not always be set."""
    friendly_name: builtins.str
    """A human friendly name when the button name or link name isn't descriptive."""
    hotkey: builtins.str
    """Hotkey. May not always be set."""
    remaps_to_ability_id: builtins.int
    """This ability id may be represented by the given more generic id."""
    available: builtins.bool
    """If true, the ability may be used by this set of mods/map."""
    target: global___AbilityData.Target.ValueType
    """Determines if a point is optional or required."""
    allow_minimap: builtins.bool
    """Can be cast in the minimap."""
    allow_autocast: builtins.bool
    """Autocast can be set."""
    is_building: builtins.bool
    """Requires placement to construct a building."""
    footprint_radius: builtins.float
    """Estimation of the footprint size. Need a better footprint."""
    is_instant_placement: builtins.bool
    """Placement next to an existing structure, e.g., an add-on like a Tech Lab."""
    cast_range: builtins.float
    """Range unit can cast ability without needing to approach target."""
    def __init__(
        self,
        *,
        ability_id: builtins.int | None = ...,
        link_name: builtins.str | None = ...,
        link_index: builtins.int | None = ...,
        button_name: builtins.str | None = ...,
        friendly_name: builtins.str | None = ...,
        hotkey: builtins.str | None = ...,
        remaps_to_ability_id: builtins.int | None = ...,
        available: builtins.bool | None = ...,
        target: global___AbilityData.Target.ValueType | None = ...,
        allow_minimap: builtins.bool | None = ...,
        allow_autocast: builtins.bool | None = ...,
        is_building: builtins.bool | None = ...,
        footprint_radius: builtins.float | None = ...,
        is_instant_placement: builtins.bool | None = ...,
        cast_range: builtins.float | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["ability_id", b"ability_id", "allow_autocast", b"allow_autocast", "allow_minimap", b"allow_minimap", "available", b"available", "button_name", b"button_name", "cast_range", b"cast_range", "footprint_radius", b"footprint_radius", "friendly_name", b"friendly_name", "hotkey", b"hotkey", "is_building", b"is_building", "is_instant_placement", b"is_instant_placement", "link_index", b"link_index", "link_name", b"link_name", "remaps_to_ability_id", b"remaps_to_ability_id", "target", b"target"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["ability_id", b"ability_id", "allow_autocast", b"allow_autocast", "allow_minimap", b"allow_minimap", "available", b"available", "button_name", b"button_name", "cast_range", b"cast_range", "footprint_radius", b"footprint_radius", "friendly_name", b"friendly_name", "hotkey", b"hotkey", "is_building", b"is_building", "is_instant_placement", b"is_instant_placement", "link_index", b"link_index", "link_name", b"link_name", "remaps_to_ability_id", b"remaps_to_ability_id", "target", b"target"]) -> None: ...

global___AbilityData = AbilityData

@typing_extensions.final
class DamageBonus(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    ATTRIBUTE_FIELD_NUMBER: builtins.int
    BONUS_FIELD_NUMBER: builtins.int
    attribute: global___Attribute.ValueType
    bonus: builtins.float
    def __init__(
        self,
        *,
        attribute: global___Attribute.ValueType | None = ...,
        bonus: builtins.float | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["attribute", b"attribute", "bonus", b"bonus"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["attribute", b"attribute", "bonus", b"bonus"]) -> None: ...

global___DamageBonus = DamageBonus

@typing_extensions.final
class Weapon(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    class _TargetType:
        ValueType = typing.NewType("ValueType", builtins.int)
        V: typing_extensions.TypeAlias = ValueType

    class _TargetTypeEnumTypeWrapper(google.protobuf.internal.enum_type_wrapper._EnumTypeWrapper[Weapon._TargetType.ValueType], builtins.type):  # noqa: F821
        DESCRIPTOR: google.protobuf.descriptor.EnumDescriptor
        Ground: Weapon._TargetType.ValueType  # 1
        Air: Weapon._TargetType.ValueType  # 2
        Any: Weapon._TargetType.ValueType  # 3

    class TargetType(_TargetType, metaclass=_TargetTypeEnumTypeWrapper): ...
    Ground: Weapon.TargetType.ValueType  # 1
    Air: Weapon.TargetType.ValueType  # 2
    Any: Weapon.TargetType.ValueType  # 3

    TYPE_FIELD_NUMBER: builtins.int
    DAMAGE_FIELD_NUMBER: builtins.int
    DAMAGE_BONUS_FIELD_NUMBER: builtins.int
    ATTACKS_FIELD_NUMBER: builtins.int
    RANGE_FIELD_NUMBER: builtins.int
    SPEED_FIELD_NUMBER: builtins.int
    type: global___Weapon.TargetType.ValueType
    damage: builtins.float
    @property
    def damage_bonus(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[global___DamageBonus]: ...
    attacks: builtins.int
    """Number of hits per attack. (eg. Colossus has 2 beams)"""
    range: builtins.float
    speed: builtins.float
    """Time between attacks."""
    def __init__(
        self,
        *,
        type: global___Weapon.TargetType.ValueType | None = ...,
        damage: builtins.float | None = ...,
        damage_bonus: collections.abc.Iterable[global___DamageBonus] | None = ...,
        attacks: builtins.int | None = ...,
        range: builtins.float | None = ...,
        speed: builtins.float | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["attacks", b"attacks", "damage", b"damage", "range", b"range", "speed", b"speed", "type", b"type"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["attacks", b"attacks", "damage", b"damage", "damage_bonus", b"damage_bonus", "range", b"range", "speed", b"speed", "type", b"type"]) -> None: ...

global___Weapon = Weapon

@typing_extensions.final
class UnitTypeData(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    UNIT_ID_FIELD_NUMBER: builtins.int
    NAME_FIELD_NUMBER: builtins.int
    AVAILABLE_FIELD_NUMBER: builtins.int
    CARGO_SIZE_FIELD_NUMBER: builtins.int
    MINERAL_COST_FIELD_NUMBER: builtins.int
    VESPENE_COST_FIELD_NUMBER: builtins.int
    FOOD_REQUIRED_FIELD_NUMBER: builtins.int
    FOOD_PROVIDED_FIELD_NUMBER: builtins.int
    ABILITY_ID_FIELD_NUMBER: builtins.int
    RACE_FIELD_NUMBER: builtins.int
    BUILD_TIME_FIELD_NUMBER: builtins.int
    HAS_VESPENE_FIELD_NUMBER: builtins.int
    HAS_MINERALS_FIELD_NUMBER: builtins.int
    SIGHT_RANGE_FIELD_NUMBER: builtins.int
    TECH_ALIAS_FIELD_NUMBER: builtins.int
    UNIT_ALIAS_FIELD_NUMBER: builtins.int
    TECH_REQUIREMENT_FIELD_NUMBER: builtins.int
    REQUIRE_ATTACHED_FIELD_NUMBER: builtins.int
    ATTRIBUTES_FIELD_NUMBER: builtins.int
    MOVEMENT_SPEED_FIELD_NUMBER: builtins.int
    ARMOR_FIELD_NUMBER: builtins.int
    WEAPONS_FIELD_NUMBER: builtins.int
    unit_id: builtins.int
    """Stable ID."""
    name: builtins.str
    """Catalog name of the unit."""
    available: builtins.bool
    """If true, the ability may be used by this set of mods/map."""
    cargo_size: builtins.int
    """Number of cargo slots it occupies in transports."""
    mineral_cost: builtins.int
    vespene_cost: builtins.int
    food_required: builtins.float
    food_provided: builtins.float
    ability_id: builtins.int
    """The ability that builds this unit."""
    race: s2clientprotocol.common_pb2.Race.ValueType
    build_time: builtins.float
    has_vespene: builtins.bool
    has_minerals: builtins.bool
    sight_range: builtins.float
    """Range unit reveals vision."""
    @property
    def tech_alias(self) -> google.protobuf.internal.containers.RepeatedScalarFieldContainer[builtins.int]:
        """Other units that satisfy the same tech requirement."""
    unit_alias: builtins.int
    """The morphed variant of this unit."""
    tech_requirement: builtins.int
    """Structure required to build this unit. (Or any with the same tech_alias)"""
    require_attached: builtins.bool
    """Whether tech_requirement is an add-on."""
    @property
    def attributes(self) -> google.protobuf.internal.containers.RepeatedScalarFieldContainer[global___Attribute.ValueType]:
        """Values include changes from upgrades"""
    movement_speed: builtins.float
    armor: builtins.float
    @property
    def weapons(self) -> google.protobuf.internal.containers.RepeatedCompositeFieldContainer[global___Weapon]: ...
    def __init__(
        self,
        *,
        unit_id: builtins.int | None = ...,
        name: builtins.str | None = ...,
        available: builtins.bool | None = ...,
        cargo_size: builtins.int | None = ...,
        mineral_cost: builtins.int | None = ...,
        vespene_cost: builtins.int | None = ...,
        food_required: builtins.float | None = ...,
        food_provided: builtins.float | None = ...,
        ability_id: builtins.int | None = ...,
        race: s2clientprotocol.common_pb2.Race.ValueType | None = ...,
        build_time: builtins.float | None = ...,
        has_vespene: builtins.bool | None = ...,
        has_minerals: builtins.bool | None = ...,
        sight_range: builtins.float | None = ...,
        tech_alias: collections.abc.Iterable[builtins.int] | None = ...,
        unit_alias: builtins.int | None = ...,
        tech_requirement: builtins.int | None = ...,
        require_attached: builtins.bool | None = ...,
        attributes: collections.abc.Iterable[global___Attribute.ValueType] | None = ...,
        movement_speed: builtins.float | None = ...,
        armor: builtins.float | None = ...,
        weapons: collections.abc.Iterable[global___Weapon] | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["ability_id", b"ability_id", "armor", b"armor", "available", b"available", "build_time", b"build_time", "cargo_size", b"cargo_size", "food_provided", b"food_provided", "food_required", b"food_required", "has_minerals", b"has_minerals", "has_vespene", b"has_vespene", "mineral_cost", b"mineral_cost", "movement_speed", b"movement_speed", "name", b"name", "race", b"race", "require_attached", b"require_attached", "sight_range", b"sight_range", "tech_requirement", b"tech_requirement", "unit_alias", b"unit_alias", "unit_id", b"unit_id", "vespene_cost", b"vespene_cost"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["ability_id", b"ability_id", "armor", b"armor", "attributes", b"attributes", "available", b"available", "build_time", b"build_time", "cargo_size", b"cargo_size", "food_provided", b"food_provided", "food_required", b"food_required", "has_minerals", b"has_minerals", "has_vespene", b"has_vespene", "mineral_cost", b"mineral_cost", "movement_speed", b"movement_speed", "name", b"name", "race", b"race", "require_attached", b"require_attached", "sight_range", b"sight_range", "tech_alias", b"tech_alias", "tech_requirement", b"tech_requirement", "unit_alias", b"unit_alias", "unit_id", b"unit_id", "vespene_cost", b"vespene_cost", "weapons", b"weapons"]) -> None: ...

global___UnitTypeData = UnitTypeData

@typing_extensions.final
class UpgradeData(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    UPGRADE_ID_FIELD_NUMBER: builtins.int
    NAME_FIELD_NUMBER: builtins.int
    MINERAL_COST_FIELD_NUMBER: builtins.int
    VESPENE_COST_FIELD_NUMBER: builtins.int
    RESEARCH_TIME_FIELD_NUMBER: builtins.int
    ABILITY_ID_FIELD_NUMBER: builtins.int
    upgrade_id: builtins.int
    """Stable ID."""
    name: builtins.str
    mineral_cost: builtins.int
    vespene_cost: builtins.int
    research_time: builtins.float
    ability_id: builtins.int
    def __init__(
        self,
        *,
        upgrade_id: builtins.int | None = ...,
        name: builtins.str | None = ...,
        mineral_cost: builtins.int | None = ...,
        vespene_cost: builtins.int | None = ...,
        research_time: builtins.float | None = ...,
        ability_id: builtins.int | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["ability_id", b"ability_id", "mineral_cost", b"mineral_cost", "name", b"name", "research_time", b"research_time", "upgrade_id", b"upgrade_id", "vespene_cost", b"vespene_cost"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["ability_id", b"ability_id", "mineral_cost", b"mineral_cost", "name", b"name", "research_time", b"research_time", "upgrade_id", b"upgrade_id", "vespene_cost", b"vespene_cost"]) -> None: ...

global___UpgradeData = UpgradeData

@typing_extensions.final
class BuffData(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    BUFF_ID_FIELD_NUMBER: builtins.int
    NAME_FIELD_NUMBER: builtins.int
    buff_id: builtins.int
    """Stable ID."""
    name: builtins.str
    def __init__(
        self,
        *,
        buff_id: builtins.int | None = ...,
        name: builtins.str | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["buff_id", b"buff_id", "name", b"name"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["buff_id", b"buff_id", "name", b"name"]) -> None: ...

global___BuffData = BuffData

@typing_extensions.final
class EffectData(google.protobuf.message.Message):
    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    EFFECT_ID_FIELD_NUMBER: builtins.int
    NAME_FIELD_NUMBER: builtins.int
    FRIENDLY_NAME_FIELD_NUMBER: builtins.int
    RADIUS_FIELD_NUMBER: builtins.int
    effect_id: builtins.int
    """Stable ID."""
    name: builtins.str
    friendly_name: builtins.str
    radius: builtins.float
    def __init__(
        self,
        *,
        effect_id: builtins.int | None = ...,
        name: builtins.str | None = ...,
        friendly_name: builtins.str | None = ...,
        radius: builtins.float | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["effect_id", b"effect_id", "friendly_name", b"friendly_name", "name", b"name", "radius", b"radius"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["effect_id", b"effect_id", "friendly_name", b"friendly_name", "name", b"name", "radius", b"radius"]) -> None: ...

global___EffectData = EffectData
